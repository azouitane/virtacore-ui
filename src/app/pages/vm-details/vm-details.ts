import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { VmsService } from '../../core/api/vms.service';
import { VmSocketService } from '../../core/api/socket.service';
import { VirtualMachine } from '../../models/VirtualMachine';
import { VmMonitor } from '../../models/VmMonitor';

@Component({
  selector: 'app-vm-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './vm-details.html',
  styleUrl: './vm-details.scss',
})
export class VmDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly socket = inject(VmSocketService);
  private readonly vmService = inject(VmsService);
  private readonly router = inject(Router);

  private subTracker = new Subscription();

  // Keep template compatibility with your Signals setup
  vm = signal<VirtualMachine | null>(null);
  vmMonitor = signal<VmMonitor | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // Fire connection sequence safely
    this.socket.connect();

    // Stream 1: Basic VM Data
    this.subTracker.add(
      this.socket.getVmById(id).subscribe({
        next: (data) => this.vm.set(data),
        error: (err) => console.error('Error fetching VM through WS:', err),
      }),
    );

    // Stream 2: Live Performance Metrics
    this.subTracker.add(
      this.socket.monitorVm(id).subscribe({
        next: (data) => this.vmMonitor.set(data),
        error: (err) => console.error('Error in monitoring channel:', err),
      }),
    );
  }

  ngOnDestroy(): void {
    // Crucial: Cleans up individual backend topics, but leaves the underlying socket active for other pages!
    this.subTracker.unsubscribe();
  }

  /* HTTP Actions remain identical */
  onStartVm(): void {
    const currentVm = this.vm();
    if (!currentVm) return;
    this.vmService.startVm(currentVm.id).subscribe();
  }

  onShutdownVm(): void {
    const currentVm = this.vm();
    if (!currentVm) return;
    this.vmService.shutdownVm(currentVm.id).subscribe();
  }

  onStopVm(): void {
    const currentVm = this.vm();
    if (!currentVm) return;
    this.vmService.stopVm(currentVm.id).subscribe();
  }

  onDeleteVm(): void {
    const currentVm = this.vm();

    if (currentVm && confirm(`Are you sure you want to permanently delete ${currentVm.name}?`)) {
      this.vmService.deleteVm(currentVm.id).subscribe({
        next: () => {
        setTimeout(() => {
          this.router.navigate(['/layout/vms']); 
        }, 2000);
        },
        error: (err) => {
          console.error('Delete failed', err);
        },
      });
    }
  }
}
