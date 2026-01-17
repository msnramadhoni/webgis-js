import { useCallback, useState } from 'react';

interface FileUploadProps {
    onFileUpload: (file: File) => void;
    uploadedFile: { content: string; filename: string } | null;
    loading: boolean;
}

export default function FileUpload({ onFileUpload, uploadedFile, loading }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.inp')) {
                onFileUpload(file);
            }
        }
    }, [onFileUpload]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onFileUpload(e.target.files[0]);
        }
    }, [onFileUpload]);

    return (
        <div className="glass-card glass-card-hover p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload INP File
            </h2>

            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                        ? 'border-purple-500 bg-purple-500/10'
                        : uploadedFile
                            ? 'border-green-500/50 bg-green-500/5'
                            : 'border-white/20 hover:border-purple-500/50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".inp"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                />

                {uploadedFile ? (
                    <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-green-300 font-medium">{uploadedFile.filename}</p>
                            <p className="text-gray-400 text-sm mt-1">File loaded successfully</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-medium">Drop your .inp file here</p>
                            <p className="text-gray-400 text-sm mt-1">or click to browse</p>
                        </div>
                    </div>
                )}
            </div>

            {uploadedFile && (
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 w-full btn-secondary text-sm"
                >
                    Upload Different File
                </button>
            )}
        </div>
    );
}
