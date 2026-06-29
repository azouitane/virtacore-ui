import { OnDestroy, Service } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { VmMonitor } from '../../models/VmMonitor';
import { VirtualMachine } from '../../models/VirtualMachine';
import { VirtualMachineSummary } from '../../models/VirtualMachineSummary';
import { BehaviorSubject, filter, first, Observable, switchMap, take } from 'rxjs';
import { LxcContainerSummary } from '../../models/LxcContainerSummary';
import { LxcMonitor } from '../../models/LxcMonitor';
import { LxcContainer } from '../../models/LxcContainer';

@Service()
export class VmSocketService implements OnDestroy {
  private token = localStorage.getItem('access_token');
  private client: Client;

  // 1. Maintain a single source of truth for connection status
  private connected$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${this.token}`
      },
      debug: (str) => console.log('STOMP Debug:', str) // Temporary: turn on to catch backend handshake errors
    });

    // 2. Assign handlers exactly ONCE in the constructor
    this.client.onConnect = () => {
      console.log('STOMP fully connected via Service');
      this.connected$.next(true);
    };

    this.client.onDisconnect = () => {
      console.log('STOMP disconnected');
      this.connected$.next(false);
    };
  }

  connect(): void {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  /**
   * Listens safely to a topic. Replays cleanly if connection is already established.
   */
  private listenToTopic<T>(topic: string, setupAction?: () => void): Observable<T> {
    return this.connected$.pipe(
      filter(isConnected => isConnected === true), // Hold stream execution until true
      take(1), // Stop taking connection updates once verified active
      switchMap(() => new Observable<T>((subscriber) => {
        
    
        const subscription: StompSubscription = this.client.subscribe(topic, (message: IMessage) => {
          subscriber.next(JSON.parse(message.body) as T);
        });

        if (setupAction) {
          setupAction();
        }

        return () => {
          console.log(`Unsubscribed from topic: ${topic}`);
          subscription.unsubscribe();
        };
      }))
    );
  }

  getAllVms(): Observable<VirtualMachineSummary[]> {
    return this.listenToTopic<VirtualMachineSummary[]>('/topic/vms');
  }

  getAllLxc() : Observable<LxcContainerSummary[]> {
    return this.listenToTopic<LxcContainerSummary[]>('/topic/lxc');
  }

  
  getVmById(id: string): Observable<VirtualMachine> {
    return this.listenToTopic<VirtualMachine>(`/topic/vms/${id}`, () => {
      this.client.publish({ destination: `/app/vms/${id}`, body: '' });
    });
  }

    getLxcById(id: string): Observable<LxcContainer> {
    return this.listenToTopic<LxcContainer>(`/topic/lxc/${id}`, () => {
      this.client.publish({ destination: `/app/lxc/${id}`, body: '' });
    });
  }

  monitorVm(id: string): Observable<VmMonitor> {
    return this.listenToTopic<VmMonitor>(`/topic/vms/${id}/status`, () => {
      this.client.publish({ destination: `/app/vms/${id}/monitor`, body: '' });
    });
  }


  
  monitorLxc(id: string): Observable<LxcMonitor> {
    return this.listenToTopic<LxcMonitor>(`/topic/lxc/${id}/status`, () => {
      this.client.publish({ destination: `/app/lxc/${id}/monitor`, body: '' })
    });
  }

  disconnect(): void {
    if (this.client.active) {
      this.client.deactivate();
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}