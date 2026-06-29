import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { LxcService } from '../../core/api/lxc.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { VmSocketService } from '../../core/api/socket.service';
import { LxcMonitor } from '../../models/LxcMonitor';
import { LxcContainer } from '../../models/LxcContainer';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lxc-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './lxc-details.html',
  styleUrl: './lxc-details.scss',
})
export class LxcDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly socket = inject(VmSocketService);
  private readonly lxcService = inject(LxcService);
  private readonly router = inject(Router);

  private subTracker = new Subscription();

  lxc = signal<LxcContainer | null>(null);
  lxcMonitor = signal<LxcMonitor | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // Fire connection sequence safely
    this.socket.connect();

        // Stream 1: Basic VM Data
    this.subTracker.add(
      this.socket.getLxcById(id).subscribe({
        next: (data) => this.lxc.set(data),
        error: (err) => console.error('Error fetching VM through WS:', err),
      }),
    );

    // Stream 2: Live Performance Metrics
    this.subTracker.add(
      this.socket.monitorLxc(id).subscribe({
        next: (data) => this.lxcMonitor.set(data),
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
    const currentLxc = this.lxc();
    if (!currentLxc) return;
    this.lxcService.startVm(currentLxc.id).subscribe();
  }

  onShutdownVm(): void {
    const currentLxc = this.lxc();
    if (!currentLxc) return;
    this.lxcService.shutdownVm(currentLxc.id).subscribe();
  }

  onStopVm(): void {
    const currentLxc = this.lxc();
    if (!currentLxc) return;
    this.lxcService.stopVm(currentLxc.id).subscribe();
  }

  onDeleteVm(): void {
    const currentLxc = this.lxc();

    if (currentLxc && confirm(`Are you sure you want to permanently delete ${currentLxc.hostname}?`)) {
      this.lxcService.deleteVm(currentLxc.id).subscribe({
        next: () => {
        setTimeout(() => {
          this.router.navigate(['/layout/lxc-containers']); 
        }, 2000);
        },
        error: (err) => {
          console.error('Delete failed', err);
        },
      });
    }
  }
}
