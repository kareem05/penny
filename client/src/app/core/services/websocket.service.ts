// apps/client/src/app/core/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;
  private connected$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.socket = io(environment.wsUrl, {
      autoConnect: false,
      auth: {
        token: localStorage.getItem('token')
      }
    });

    this.socket.on('connect', () => {
      this.connected$.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connected$.next(false);
    });
  }

  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  on<T>(event: string): Observable<T> {
    return new Observable(observer => {
      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  isConnected(): Observable<boolean> {
    return this.connected$.asObservable();
  }
}