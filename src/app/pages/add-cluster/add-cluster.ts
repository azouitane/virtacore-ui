import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClustersService } from '../../core/api/clusters.service';
// Note: You can likely remove the 'AddCluster' model import if it's not being used as a type here

@Component({
  selector: 'app-add-cluster',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './add-cluster.html',
  styleUrl: './add-cluster.scss',
})
export class AddCluster {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly clustersService = inject(ClustersService);
  private readonly router = inject(Router);

  clusterForm = this.fb.group({
    name: ['', Validators.required],
    host: ['', Validators.required],
    apiPort: [8006, [Validators.required]],
    tokenId: ['', [Validators.required]],
    tokenSecret: ['', [Validators.required]],
  });

  addCluster() {
    // 1. Good practice: Guard against invalid form submissions
    if (this.clusterForm.invalid) {
      this.clusterForm.markAllAsTouched();
      return;
    }

    // 2. Pass the actual form value data to the service
    const clusterData = this.clusterForm.getRawValue();

    this.clustersService.addCluster(clusterData).subscribe({
      next: () => {
        this.router.navigate(['/clusters']);
      },
      error: (err) => {
        console.error('Failed to add cluster:', err);
        // TODO: Handle error UI feedback here
      }
    });

  }
}
