import { useState } from 'react';

interface ConfigFormProps {
    onSubmit: (config: {
        pipeToClose: string;
        timeSec: number;
        topN: number;
        okBarMin: number;
        veryLowMax: number;
    }) => void;
    disabled: boolean;
    loading: boolean;
}

export default function ConfigForm({ onSubmit, disabled, loading }: ConfigFormProps) {
    const [config, setConfig] = useState({
        pipeToClose: 'P1106',
        timeSec: 3600,
        topN: 20,
        okBarMin: 3.0,
        veryLowMax: 1.0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(config);
    };

    return (
        <div className="glass-card glass-card-hover p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Configuration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pipe to Close
                    </label>
                    <input
                        type="text"
                        value={config.pipeToClose}
                        onChange={(e) => setConfig({ ...config, pipeToClose: e.target.value })}
                        className="input-field"
                        placeholder="e.g., P1106"
                        required
                        disabled={disabled}
                    />
                    <p className="text-xs text-gray-400 mt-1">Enter the pipe ID to simulate closure</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Time (seconds)
                        </label>
                        <input
                            type="number"
                            value={config.timeSec}
                            onChange={(e) => setConfig({ ...config, timeSec: parseInt(e.target.value) })}
                            className="input-field"
                            min="0"
                            required
                            disabled={disabled}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Top N Results
                        </label>
                        <input
                            type="number"
                            value={config.topN}
                            onChange={(e) => setConfig({ ...config, topN: parseInt(e.target.value) })}
                            className="input-field"
                            min="1"
                            required
                            disabled={disabled}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            OK Threshold (bar)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={config.okBarMin}
                            onChange={(e) => setConfig({ ...config, okBarMin: parseFloat(e.target.value) })}
                            className="input-field"
                            min="0"
                            required
                            disabled={disabled}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Very Low Max (bar)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={config.veryLowMax}
                            onChange={(e) => setConfig({ ...config, veryLowMax: parseFloat(e.target.value) })}
                            className="input-field"
                            min="0"
                            required
                            disabled={disabled}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={disabled || loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Running Analysis...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Run Analysis
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
