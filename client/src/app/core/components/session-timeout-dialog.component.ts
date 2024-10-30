// apps/client/src/app/core/components/session-timeout-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-timeout-dialog',
  template: `
    <h2 mat-dialog-title>Session Timeout Warning</h2>
    <mat-dialog-content>
      <p>Your session will expire in {{ data.timeLeft / 60 }} minutes. Would you like to continue your session?</p>
      <mat-progress-bar mode="determinate" [value]="(data.timeLeft / 300) * 100"></mat-progress-bar>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onLogout()">Logout</button>
      <button mat-raised-button color="primary" (click)="onContinue()">
        Continue Session
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 300px;
    }
    mat-progress-bar {
      margin-top: 16px;
    }
  `]
})
export class SessionTimeoutDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SessionTimeoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { timeLeft: number }
  ) {}

  onContinue() {
    this.dialogRef.close(true);
  }

  onLogout() {
    this.dialogRef.close(false);
  }
}
