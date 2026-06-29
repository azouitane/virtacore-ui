export interface VmMonitor {

  cpuPercent: number;

  memoryGB: number;

  memoryPercent: number;

  diskReadMB: number;

  diskWriteMB: number;

  networkInMB: number;

  networkOutMB: number;

  uptimeMinutes: number;

}