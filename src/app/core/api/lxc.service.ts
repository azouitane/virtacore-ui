import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environments';
import { CreateLxcPayload } from '../../models/CreateLxcPayload';
import { Observable } from 'rxjs';
import { LxcTemplate } from '../../models/LxcTemplate';
import { LxcContainer } from '../../models/LxcContainer';

@Service()
export class LxcService {
 private readonly http = inject(HttpClient);


 // Base resource URL patterns matching your API structure
  private readonly baseUrl = environment.apiUrl; // e.g., 'http://localhost:8080/api/v1'

  /**
   * Fetches all available operating system templates for LXC containers
   */
  getTemplates(): Observable<LxcTemplate[]> {
    return this.http.get<LxcTemplate[]>(`${this.baseUrl}/lxc-templates`);
  }

  getLxcId(id: string): Observable<LxcContainer> {
    return this.http.get<LxcContainer>(`${this.baseUrl}/lxc/${id}`);
  }

  /**
   * Provisions a new LXC container configuration
   */
  createLxc(payload: CreateLxcPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/lxc`, payload);
  }

    startVm(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/lxc/${id}/start`, {});
  }

  shutdownVm(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/lxc/${id}/shutdown`, {});
  }

  stopVm(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/lxc/${id}/stop`, {});
  }

  deleteVm(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/lxc/${id}`);
  }
}
