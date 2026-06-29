import { Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LxcService } from './../../core/api/lxc.service';
import { ClustersService } from '../../core/api/clusters.service';
import { ClusterSummary } from '../../models/ClusterSummary';
import { LxcTemplate } from '../../models/LxcTemplate';
import { CreateLxcPayload } from '../../models/CreateLxcPayload';

@Component({
  selector: 'app-create-lxc',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-lxc.html',
  styleUrl: './create-lxc.scss',
})
export class CreateLxc implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly clustersService = inject(ClustersService);
  private readonly lxcService = inject(LxcService);
  private readonly router = inject(Router);

  clusters = signal<ClusterSummary[]>([]);
  templates = signal<LxcTemplate[]>([]);
  loading = signal(false);
  successMessage = signal<string | null>(null);

  lxcForm = this.fb.group({
    hostname: ['', Validators.required],
    clusterId: ['', Validators.required],
    templateId: ['', Validators.required], // Set to string to match UUID logic
    cores: [2, [Validators.required, Validators.min(1)]], // Changed from 'cpu' to 'cores' to match payload
    memory: [2048, [Validators.required, Validators.min(512)]],
    swap: [512, [Validators.required, Validators.min(256)]],
    disk: [30, [Validators.required, Validators.min(10)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    nesting: [false, Validators.required], // Initialize as Boolean directly
  });

  ngOnInit(): void {
    // Corrected: Automatically load your data when component mounts!
    this.loadClusters();
    this.loadTemplates();
  }

  loadClusters(): void {
    this.clustersService.getClusterSummary().subscribe({
      next: (data) => this.clusters.set(data),
      error: (err) => console.error('Failed to load clusters:', err),
    });
  }

  loadTemplates(): void {
    this.lxcService.getTemplates().subscribe({
      next: (data) => this.templates.set(data),
      error: (err) => console.error('Failed to load templates:', err),
    });
  }

  AddVm(): void {
    if (this.lxcForm.invalid) {
      this.lxcForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.successMessage.set(null); // Clear old messages

    const formValues = this.lxcForm.getRawValue();

    // Map fields accurately to match your backend model explicitly
    const payload: CreateLxcPayload = {
      hostname: formValues.hostname,
      clusterId: formValues.clusterId,
      templateId: formValues.templateId,
      cores: Number(formValues.cores),
      memory: Number(formValues.memory),
      swap: Number(formValues.swap), // Added missing swap property
      disk: Number(formValues.disk),
      password: formValues.password,
      nesting: formValues.nesting,
    };

    this.lxcService.createLxc(payload).subscribe({
      next: (res: any) => {
        console.log('VM CREATED SUCCESSFULLY:', res);
        this.loading.set(false);
        this.successMessage.set(`${res.message || 'Success'}! VM ID: ${res.vm || ''}`);

        setTimeout(() => {
          this.router.navigate(['/layout/lxc-containers']);
        }, 2000);
      },
      error: (err) => {
        console.error('VM Creation failed:', err);
        this.loading.set(false);
      },
    });
  }
}
