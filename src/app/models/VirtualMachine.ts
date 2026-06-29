export interface VirtualMachine {

  id: string;
  vmId: number;
  name: string;
  node: string;
  cpu: number;
  memory: number;
  disk: number;
  status: string;
  clusterName : string;
  os: string;
  version: string;
  createdAt: string;

}