import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Clusters } from '../../models/Cluster';
import { ClusterSummary } from '../../models/ClusterSummary';
import { AddCluster } from '../../models/AddCluster';

@Service()
export class ClustersService {
  private readonly http = inject(HttpClient);

  private readonly url = `${environment.apiUrl}/clusters`;

  // Get all clusters
  getClusters(): Observable<Clusters[]> {
    return this.http.get<Clusters[]>(this.url);
  }

  // Get cluster summary information
  getClusterSummary(): Observable<ClusterSummary[]> {
    return this.http.get<ClusterSummary[]>(`${this.url}/summary`);
  }

  addCluster(cluster: AddCluster): Observable<AddCluster> {
    return this.http.post<any>(this.url, cluster);
  }
}
