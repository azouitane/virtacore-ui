export interface LxcContainerSummary {
    id: string;
    lxcId: number;
    hostname: string;
    host: string;
    ip: string;
    osVersion: string;
    status: string;
    cpuPercent: number;
    memoryPercent: number;
}