import { useState } from 'react';
import { AnalysisResult } from '../types';
import NetworkMap from './NetworkMap';

interface ResultsPanelProps {
    result: AnalysisResult | null;
    loading: boolean;
}

export default function ResultsPanel({ result, loading }: ResultsPanelProps) {
    const [selectedView, setSelectedView] = useState<'pressure' | 'impact' | 'drop' | null>(null);

    if (!result && !loading) {
        return (
            <div className="glass-card p-12 text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Analysis Yet</h3>
                <p className="text-gray-400">Upload an INP file and configure parameters to start</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="glass-card p-12 text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6">
                    <svg className="animate-spin text-purple-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Running Analysis...</h3>
                <p className="text-gray-400">This may take a few moments</p>
            </div>
        );
    }

    if (result) {
        const downloadCSV = () => {
            const blob = new Blob([result.csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'analysis_results.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        };

        return (
            <div className="space-y-6">
                {/* Summary Card */}
                <div className="glass-card glass-card-hover p-6 animate-fade-in">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Analysis Complete
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-gray-400 text-sm mb-1">Time</p>
                            <p className="text-white font-semibold">{result.usedTime / 3600} hours</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-gray-400 text-sm mb-1">Mean Pressure Base</p>
                            <p className="text-white font-semibold">{result.meanPressureBase.toFixed(2)} m</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-gray-400 text-sm mb-1">Mean Drop</p>
                            <p className="text-white font-semibold">{result.meanDrop.toFixed(2)} m</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedView('pressure')}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                            Pressure Map
                        </button>
                        <button
                            onClick={() => setSelectedView('impact')}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Impact Map
                        </button>
                        <button
                            onClick={() => setSelectedView('drop')}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                            Pressure Drop
                        </button>
                        <button
                            onClick={downloadCSV}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download CSV
                        </button>
                    </div>
                </div>

                {/* Top Impacted Nodes */}
                <div className="glass-card glass-card-hover p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4">Top Impacted Nodes</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Node ID</th>
                                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Pressure Closed</th>
                                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Drop</th>
                                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.topImpactedNodes.map((node, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-2 px-3 text-white font-mono">{node.node_id}</td>
                                        <td className="py-2 px-3 text-gray-300">{node.pressure_closed_m.toFixed(1)} m</td>
                                        <td className="py-2 px-3 text-gray-300">{node.drop_m.toFixed(1)} m</td>
                                        <td className="py-2 px-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${node.status === 'OK' ? 'bg-green-500/20 text-green-300' :
                                                node.status === 'RENDAH' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    node.status === 'SANGAT RENDAH' ? 'bg-orange-500/20 text-orange-300' :
                                                        'bg-red-500/20 text-red-300'
                                                }`}>
                                                {node.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Visualization Modal */}
                {selectedView && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in" onClick={() => setSelectedView(null)}>
                        <div className="glass-card max-w-6xl w-full h-[85vh] flex flex-col p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">
                                    {selectedView === 'pressure' ? 'Pressure Analysis Map' :
                                        selectedView === 'impact' ? 'Service Impact Map' : 'Pressure Drop Map'}
                                </h3>
                                <button onClick={() => setSelectedView(null)} className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 bg-black/20 rounded-lg overflow-hidden">
                                <NetworkMap
                                    nodes={result.nodes}
                                    links={result.links}
                                    type={selectedView}
                                    title={selectedView === 'pressure' ? 'Current Pressure (m)' :
                                        selectedView === 'impact' ? 'Service Status' : 'Pressure Drop (m)'}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
