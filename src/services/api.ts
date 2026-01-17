import axios from 'axios';
import { AnalysisResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface AnalysisRequest {
    inpContent: string;
    pipeToClose: string;
    timeSec?: number;
    topN?: number;
    okBarMin?: number;
    veryLowMax?: number;
}

export interface AnalysisResponse {
    success: boolean;
    data?: AnalysisResult;
    error?: string;
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 120000, // 2 minutes for analysis
});

export const analysisAPI = {
    // Run analysis
    runAnalysis: async (request: AnalysisRequest): Promise<AnalysisResult> => {
        const response = await api.post<AnalysisResponse>('/analyze', request);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || 'Analysis failed');
        }

        return response.data.data;
    },
};

export default api;
