import { Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClustersService } from '../../core/api/clusters.service';
import { TemplatesService } from '../../core/api/templates.service';
import { VmsService } from '../../core/api/vms.service';
import { ClusterSummary } from '../../models/ClusterSummary';
import { TemplateSummary } from '../../models/TemplateSummary';
import { CreateVmReq } from '../../models/CreateVmReq';

@Component({
  selector: 'app-create-vm',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-vm.html',
  styleUrl: './create-vm.scss',
})
export class CreateVm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly clustersService = inject(ClustersService);
  private readonly templatesService = inject(TemplatesService);
  private readonly vmsService = inject(VmsService);
  private readonly router = inject(Router);

  clusters = signal<ClusterSummary[]>([]);
  templates = signal<TemplateSummary[]>([]);
  loading = signal(false);
  successMessage = signal<string | null>(null); // الـ Signal اللي غانحطو فيه الميساج

  vmForm = this.fb.group({
    name: ['', Validators.required],
    clusterId: ['', Validators.required],
    proxmoxTemplateId: [0, [Validators.required, Validators.min(1)]],
    cpu: [2, [Validators.required, Validators.min(1)]],
    memory: [2048, [Validators.required, Validators.min(512)]],
    disk: [30, [Validators.required, Validators.min(10)]],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.loadClusters();
    this.loadTemplates();
  }

  loadClusters(): void {
    this.clustersService.getClusterSummary().subscribe({
      next: (data) => this.clusters.set(data),
      error: (err) => console.error('Failed to load clusters:', err)
    });
  }

  loadTemplates(): void {
    this.templatesService.getTemplateSummary().subscribe({
      next: (data) => this.templates.set(data),
      error: (err) => console.error('Failed to load templates:', err)
    });
  }

  AddVm(): void {
    if (this.vmForm.invalid) {
      this.vmForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.successMessage.set(null); // كنخويو الميساج القديم يلا كان
    const formValues = this.vmForm.getRawValue();

    const payload: CreateVmReq = {
      name: formValues.name,
      clusterId: formValues.clusterId,
      templateId: Number(formValues.proxmoxTemplateId),
      cpu: Number(formValues.cpu),
      memory: Number(formValues.memory),
      disk: Number(formValues.disk),
      username: formValues.username,
      password: formValues.password
    };

    this.vmsService.addVm(payload as any).subscribe({
      next: (res: any) => {
        console.log('VM CREATED SUCCESSFULLY:', res);
        this.loading.set(false);

        this.successMessage.set(`${res.message}! VM ID: ${res.vm}`);
        
  
        setTimeout(() => {
          this.router.navigate(['/layout/vms']); 
        }, 2000);
      },
      error: (err) => {
        console.error('VM Creation failed:', err);
        this.loading.set(false);
      },
    });
  }
}
