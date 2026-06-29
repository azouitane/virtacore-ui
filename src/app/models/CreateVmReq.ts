export interface CreateVmReq {

  name: string;

  clusterId: string;

  templateId: number;

  cpu: number;

  memory: number;

  disk: number;

  username: string;

  password: string;

}


