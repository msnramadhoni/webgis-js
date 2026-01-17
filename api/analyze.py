from http.server import BaseHTTPRequestHandler
import json
import base64
import io
import tempfile
import os
from pathlib import Path

# Import WNTR and dependencies
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd
import wntr

M_PER_BAR = 10.2

def m_to_bar(m):
    return m / M_PER_BAR

def service_status(p_bar, ok_bar_min, very_low_max):
    if pd.isna(p_bar):
        return "N/A"
    if p_bar <= 0:
        return "MATI TOTAL"
    elif p_bar < very_low_max:
        return "SANGAT RENDAH"
    elif p_bar < ok_bar_min:
        return "RENDAH"
    return "OK"

def run_pressure_at_time(wn, time_sec):
    sim = wntr.sim.EpanetSimulator(wn)
    results = sim.run_sim()
    
    times = results.node["pressure"].index
    used_time = time_sec if time_sec in times else int(times[0])
    
    p_raw = results.node["pressure"].loc[used_time].copy()
    p_clean = p_raw.copy()
    p_clean[p_clean < 0] = 0
    
    return p_raw, p_clean, used_time

def fig_to_base64(fig):
    """Convert matplotlib figure to base64 string"""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=200, bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close(fig)
    return f"data:image/png;base64,{img_base64}"

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            # Get parameters
            inp_content = data.get('inpContent')
            pipe_to_close = data.get('pipeToClose')
            time_sec = int(data.get('timeSec', 3600))
            top_n = int(data.get('topN', 20))
            ok_bar_min = float(data.get('okBarMin', 3.0))
            very_low_max = float(data.get('veryLowMax', 1.0))
            
            if not inp_content or not pipe_to_close:
                self.send_error(400, "Missing required parameters")
                return
            
            # Create temporary INP file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.inp', delete=False) as tmp:
                tmp.write(inp_content)
                tmp_path = tmp.name
            
            try:
                # Load base network
                wn_base = wntr.network.WaterNetworkModel(tmp_path)
                
                if pipe_to_close not in wn_base.link_name_list:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "error": f"Pipe '{pipe_to_close}' not found"
                    }).encode())
                    return
                
                # Run base simulation
                p_base_raw, p_base_clean, used_time = run_pressure_at_time(wn_base, time_sec)
                
                # Load closed network
                wn_closed = wntr.network.WaterNetworkModel(tmp_path)
                wn_closed.get_link(pipe_to_close).initial_status = "Closed"
                
                # Run closed simulation
                p_closed_raw, p_closed_clean, _ = run_pressure_at_time(wn_closed, used_time)
                
                # Calculate differences
                dp_m = p_base_clean - p_closed_clean
                p_base_bar = p_base_clean.apply(m_to_bar)
                p_closed_bar = p_closed_clean.apply(m_to_bar)
                dp_bar = dp_m.apply(m_to_bar)
                
                # Create results dataframe
                df = pd.DataFrame({
                    "node_id": p_base_clean.index,
                    "pressure_base_m": p_base_clean.values,
                    "pressure_closed_m": p_closed_clean.values,
                    "drop_m": dp_m.values,
                    "pressure_base_bar": p_base_bar.values,
                    "pressure_closed_bar": p_closed_bar.values,
                    "drop_bar": dp_bar.values
                })
                
                df["status"] = df["pressure_closed_bar"].apply(
                    lambda x: service_status(x, ok_bar_min, very_low_max)
                )
                
                # Add coordinates
                coords = []
                for node_id in df["node_id"]:
                    node = wn_closed.get_node(node_id)
                    if hasattr(node, "coordinates") and node.coordinates:
                        coords.append({"x": node.coordinates[0], "y": node.coordinates[1]})
                    else:
                        coords.append({"x": None, "y": None})
                
                df["x"] = [c["x"] for c in coords]
                df["y"] = [c["y"] for c in coords]
                
                # Generate pressure maps
                fig1, axes = plt.subplots(1, 3, figsize=(18, 5))
                
                wntr.graphics.plot_network(
                    wn_base, p_base_clean, node_size=20,
                    title=f"Pressure BASE (t={used_time}s)",
                    show_plot=False, ax=axes[0]
                )
                
                wntr.graphics.plot_network(
                    wn_closed, p_closed_clean, node_size=20,
                    title=f"Pressure CLOSED '{pipe_to_close}' (t={used_time}s)",
                    show_plot=False, ax=axes[1]
                )
                
                wntr.graphics.plot_network(
                    wn_closed, dp_m, node_size=20,
                    title="ΔPressure = BASE - CLOSED",
                    show_plot=False, ax=axes[2]
                )
                
                plt.tight_layout()
                pressure_maps_base64 = fig_to_base64(fig1)
                
                # Generate service impact map
                fig2, ax = plt.subplots(figsize=(10, 7))
                
                wntr.graphics.plot_network(
                    wn_closed, node_attribute=None, node_size=0,
                    title=f"Service Impact Map AFTER closing '{pipe_to_close}'",
                    show_plot=False, ax=ax
                )
                
                color_map = {
                    "MATI TOTAL": "red",
                    "SANGAT RENDAH": "orange",
                    "RENDAH": "yellow",
                    "OK": "green"
                }
                
                for status, color in color_map.items():
                    sub = df[df["status"] == status]
                    if len(sub) > 0:
                        ax.scatter(sub["x"], sub["y"], s=18, c=color, label=status, zorder=5)
                
                ax.legend(loc="best")
                ax.set_xticks([])
                ax.set_yticks([])
                plt.tight_layout()
                
                impact_map_base64 = fig_to_base64(fig2)
                
                # Prepare response
                top_impacted = df.nlargest(top_n, "drop_m")
                
                result = {
                    "success": True,
                    "data": {
                        "usedTime": int(used_time),
                        "meanPressureBase": float(p_base_clean.mean()),
                        "meanPressureClosed": float(p_closed_clean.mean()),
                        "meanDrop": float(dp_m.mean()),
                        "topImpactedNodes": top_impacted.to_dict("records"),
                        "allNodes": df.to_dict("records"),
                        "pressureMapsImage": pressure_maps_base64,
                        "impactMapImage": impact_map_base64,
                        "csvData": df.to_csv(index=False)
                    }
                }
                
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
                
            finally:
                # Clean up temp file
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": False,
                "error": str(e)
            }).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
