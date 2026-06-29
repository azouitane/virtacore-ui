export interface VirtualMachineSummary {

  id: string;
  vmid: number;
  name: string;
  host: string;
  ip: string;
  osVersion: string;
  status: string;
  cpuPercent: number;
  memoryPercent: number;
  
}