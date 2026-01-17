import React, { useMemo, useState } from 'react';
import { NodeData, LinkData } from '../types';

interface NetworkMapProps {
    nodes: NodeData[];
    links: LinkData[];
    type: 'pressure' | 'impact' | 'drop';
    title: string;
}

export default function NetworkMap({ nodes, links, type, title }: NetworkMapProps) {
    const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

    // Calculate network bounds for SVG viewbox
    const bounds = useMemo(() => {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let hasCoords = false;

        nodes.forEach(node => {
            if (node.x !== null && node.y !== null) {
                minX = Math.min(minX, node.x);
                minY = Math.min(minY, node.y);
                maxX = Math.max(maxX, node.x);
                maxY = Math.max(maxY, node.y);
                hasCoords = true;
            }
        });

        if (!hasCoords) return { x: 0, y: 0, width: 100, height: 100, minX: 0, minY: 0 };

        const width = maxX - minX;
        const height = maxY - minY;
        const padding = Math.max(width, height) * 0.1;

        return {
            minX,
            minY,
            x: minX - padding,
            y: minY - padding,
            width: width + padding * 2,
            height: height + padding * 2
        };
    }, [nodes]);

    const getColor = (node: NodeData) => {
        if (type === 'impact') {
            switch (node.status) {
                case 'MATI TOTAL': return '#ef4444'; // red-500
                case 'SANGAT RENDAH': return '#f97316'; // orange-500
                case 'RENDAH': return '#eab308'; // yellow-500
                case 'OK': return '#22c55e'; // green-500
                default: return '#6b7280'; // gray-500
            }
        } else if (type === 'pressure') {
            // Gradient from red to blue for pressure
            const p = node.pressure_closed;
            if (p <= 0) return '#ef4444';
            if (p < 10) return '#f97316';
            if (p < 20) return '#eab308';
            if (p < 40) return '#22c55e';
            return '#3b82f6'; // blue-500
        } else {
            // Drop intensity
            const d = node.drop;
            if (d < 1) return '#22c55e';
            if (d < 5) return '#eab308';
            if (d < 15) return '#f97316';
            return '#ef4444';
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/40 rounded-xl border border-white/10 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-200">{title}</h4>
                {hoveredNode && (
                    <div className="text-xs text-purple-300 font-mono">
                        ID: {hoveredNode.id} | P: {hoveredNode.pressure_closed.toFixed(2)}m
                    </div>
                )}
            </div>

            <div className="relative flex-1 min-h-[400px]">
                <svg
                    viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
                    className="w-full h-full cursor-crosshair"
                    style={{ transform: 'scaleY(-1)' }} // Invert Y for GIS coords
                >
                    {/* Links */}
                    {links.map(link => {
                        if (link.start_x === null || link.end_x === null) return null;
                        return (
                            <line
                                key={link.id}
                                x1={link.start_x}
                                y1={link.start_y!}
                                x2={link.end_x}
                                y2={link.end_y!}
                                stroke={link.status === 'Closed' ? '#ef4444' : '#ffffff22'}
                                strokeWidth={bounds.width / 400}
                                strokeDasharray={link.status === 'Closed' ? '5,5' : 'none'}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map(node => {
                        if (node.x === null || node.y === null) return null;
                        return (
                            <circle
                                key={node.id}
                                cx={node.x}
                                cy={node.y}
                                r={bounds.width / 250}
                                fill={getColor(node)}
                                onMouseEnter={() => setHoveredNode(node)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className="transition-all duration-200 hover:r-[10px]"
                                style={{ cursor: 'pointer' }}
                            />
                        );
                    })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-2 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                    {type === 'impact' ? (
                        <>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> <span className="text-[10px] text-gray-300">MATI TOTAL</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500" /> <span className="text-[10px] text-gray-300">SANGAT RENDAH</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /> <span className="text-[10px] text-gray-300">RENDAH</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> <span className="text-[10px] text-gray-300">OK</span></div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="h-2 w-24 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded" />
                            <span className="text-[10px] text-gray-400">Low → High</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
