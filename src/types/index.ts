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

export interface AnalysisConfig {
    pipeToClose: string;
    timeSec: number;
    topN: number;
    okBarMin: number;
    veryLowMax: number;
}
