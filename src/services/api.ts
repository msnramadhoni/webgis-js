import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface AnalysisRequest {
    inpContent: string;
    pipeToClose: string;
    timeSec?: number;
    topN?: number;
    okBarMin?: number;
    veryLowMax?: number;
}

export interface NodeResult {
    node_id: string;
    pressure_base_m: number;
    pressure_closed_m: number;
    drop_m: number;
    pressure_base_bar: number;
    pressure_closed_bar: number;
    drop_bar: number;
    status: string;
    x?: number;
    y?: number;
}

export interface AnalysisResult {
    usedTime: number;
    meanPressureBase: number;
    meanPressureClosed: number;
    meanDrop: number;
    topImpactedNodes: NodeResult[];
    allNodes: NodeResult[];
    pressureMapsImage: string; // base64
    impactMapImage: string; // base64
    csvData: string;
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
