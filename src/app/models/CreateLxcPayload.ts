export interface CreateLxcPayload {
  clusterId: string;
  templateId: string;
  hostname: string;
  cores: number;
  memory: number; // in MB
  swap: number;   // in MB
  disk: number;   // in GB
  password: string;
  nesting: boolean;
}