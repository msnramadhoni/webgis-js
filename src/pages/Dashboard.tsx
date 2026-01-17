import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ConfigForm from '../components/ConfigForm';
import ResultsPanel from '../components/ResultsPanel';
import { analysisAPI } from '../services/api';
import { AnalysisResult } from '../types';

export default function Dashboard() {
    const [uploadedFile, setUploadedFile] = useState<{ content: string; filename: string } | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (file: File) => {
        try {
            setLoading(true);
            setError(null);

            // Read file content
            const content = await file.text();
            setUploadedFile({ content, filename: file.name });
            setAnalysisResult(null); // Clear previous results
        } catch (err: any) {
            setError('Failed to read file');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalysisSubmit = async (config: {
        pipeToClose: string;
        timeSec: number;
        topN: number;
        okBarMin: number;
        veryLowMax: number;
    }) => {
        if (!uploadedFile) {
            setError('Please upload an INP file first');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await analysisAPI.runAnalysis({
                inpContent: uploadedFile.content,
                ...config,
            });

            setAnalysisResult(result);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to run analysis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <header className="glass-card p-6 mb-8 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold gradient-text">Water Network Analyzer</h1>
                            <p className="text-gray-300 text-sm">Advanced WNTR Analysis Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                        <span className="text-sm text-green-300 font-medium">Ready</span>
                    </div>
                </div>
            </header>

            {/* Error Alert */}
            {error && (
                <div className="glass-card p-4 mb-6 border-red-500/50 bg-red-500/10 animate-slide-up">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-300">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Upload & Config */}
                <div className="lg:col-span-1 space-y-6">
                    <FileUpload
                        onFileUpload={handleFileUpload}
                        uploadedFile={uploadedFile}
                        loading={loading}
                    />

                    <ConfigForm
                        onSubmit={handleAnalysisSubmit}
                        disabled={!uploadedFile || loading}
                        loading={loading}
                    />
                </div>

                {/* Right Column - Results */}
                <div className="lg:col-span-2">
                    <ResultsPanel
                        result={analysisResult}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}
