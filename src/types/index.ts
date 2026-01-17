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

export interface NodeData {
    id: string;
    x: number | null;
    y: number | null;
    pressure_base: number;
    pressure_closed: number;
    drop: number;
    status: string;
}

export interface LinkData {
    id: string;
    start_node: string;
    end_node: string;
    start_x: number | null;
    start_y: number | null;
    end_x: number | null;
    end_y: number | null;
    status: string;
}

export interface AnalysisResult {
    usedTime: number;
    meanPressureBase: number;
    meanPressureClosed: number;
    meanDrop: number;
    topImpactedNodes: NodeResult[];
    nodes: NodeData[];
    links: LinkData[];
    csvData: string;
}

export interface AnalysisConfig {
    pipeToClose: string;
    timeSec: number;
    topN: number;
    okBarMin: number;
    veryLowMax: number;
}
