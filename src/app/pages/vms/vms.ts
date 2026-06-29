import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Subscription } from 'rxjs';
import { VmSocketService } from '../../core/api/socket.service';
import { VmsService } from '../../core/api/vms.service';
import { VirtualMachineSummary } from '../../models/VirtualMachineSummary';

@Component({
  selector: 'app-vms',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vms.html',
  styleUrl: './vms.scss',
})
export class Vms implements OnInit, OnDestroy {
  private readonly socket = inject(VmSocketService);

  private socketSubscription?: Subscription;

  vms = signal<VirtualMachineSummary[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadVmsSocket();
  }

  loadVmsSocket(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Ensure the socket client is actively listening/connecting
    this.socket.connect();

    // Clean up any existing list subscription before creating a new one (e.g. if refreshed manually)
    this.socketSubscription?.unsubscribe();

    this.socketSubscription = this.socket.getAllVms().subscribe({
      next: (data: VirtualMachineSummary[]) => {
        this.vms.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error receiving VM list update:', err);
        this.errorMessage.set('Failed to load streaming updates for virtual machines.');
        this.isLoading.set(false);
      }
    });
  }

  refresh(): void {
    this.loadVmsSocket();
  }



  ngOnDestroy(): void {
    // Crucial: Only disconnects this specific list view channel. 
    // The main socket remains healthy for navigation.
    this.socketSubscription?.unsubscribe();
  }

}