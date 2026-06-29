import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VirtualMachineSummary } from '../../models/VirtualMachineSummary';
import { CreateVmReq } from '../../models/CreateVmReq';
import { VirtualMachine } from '../../models/VirtualMachine';


@Service()
export class VmsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/vms`;

  // Get VMs
  getVms(): Observable<VirtualMachineSummary[]> {

    return this.http.get<VirtualMachineSummary[]>(
      this.url
    );
  }

   getVm(id:string):Observable<VirtualMachine>{

    return this.http.get<VirtualMachine>(
      `${this.url}/${id}`
    );

  }

  // Create new VM
  addVm(
    request: CreateVmReq
  ): Observable<VirtualMachineSummary> {


    return this.http.post<VirtualMachineSummary>(
      this.url,
      request
    );
  }



  startVm(id: string): Observable<any> {
    return this.http.post(`${this.url}/${id}/start`, {});
  }

  shutdownVm(id: string): Observable<any> {
    return this.http.post(`${this.url}/${id}/shutdown`, {});
  }

  stopVm(id: string): Observable<any> {
    return this.http.post(`${this.url}/${id}/stop`, {});
  }

  deleteVm(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

}
