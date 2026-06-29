import { ClustersService } from '../../core/api/clusters.service';
import { Clusters } from '../../models/Cluster';
import { VmsService } from './../../core/api/vms.service';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cluster',
  imports: [RouterLink],
  templateUrl: './cluster.html',
  styleUrl: './cluster.scss',
})
export class Cluster {
  private readonly clustersService = inject(ClustersService);


  clusters = signal<Clusters[]>([]);

  isLoading = signal<boolean>(true);

  errorMessage = signal<string | null>(null);



  ngOnInit(): void {

    this.loadClusters();

  }



  loadClusters() {


    this.isLoading.set(true);

    this.errorMessage.set(null);



    this.clustersService.getClusters()
      .subscribe({

        next: (data) => {


          this.clusters.set(data);


          this.isLoading.set(false);

        },


        error: (err) => {


          console.error(err);


          this.errorMessage.set(
            "Failed to load clusters"
          );


          this.isLoading.set(false);

        }

      });

  }

}
