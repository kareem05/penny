// apps/client/src/app/core/services/session.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Timer } from 'easytimer.js';
import * as AuthActions from '../../auth/store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private timer: any;
  private readonly sessionTimeout = 8 * 60 * 60; // 8 hours in seconds
  private readonly warningTime = 5 * 60; // 5 minutes warning before timeout

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private ngZone: NgZone
  ) {}

  startSessionTimer() {
    this.timer = new Timer();
    
    this.timer.start({ countdown: true, startValues: { seconds: this.sessionTimeout } });

    this.timer.addEventListener('secondsUpdated', () => {
      const timeLeft = this.timer.getTimeValues().seconds;
      
      if (timeLeft === this.warningTime) {
        this.ngZone.run(() => this.showTimeoutWarning());
      }
    });

    this.timer.addEventListener('targetAchieved', () => {
      this.ngZone.run(() => {
        this.store.dispatch(AuthActions.logout());
      });
    });
  }

  resetTimer() {
    if (this.timer) {
      this.timer.stop();
      this.startSessionTimer();
    }
  }

  stopTimer() {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }
  }

  private showTimeoutWarning() {
    const dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { timeLeft: this.warningTime }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetTimer();
      }
    });
  }
}