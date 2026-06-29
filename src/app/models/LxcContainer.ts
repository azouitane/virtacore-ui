export interface LxcContainer {
    id: string;
    lxcId: number;
    hostname: string;
    node: string;
    cpu: number;
    memory: number;
    disk: number;
    status: string;
    clusterName: string;
    os: string;
    version: string;
    createdAt: string;
}