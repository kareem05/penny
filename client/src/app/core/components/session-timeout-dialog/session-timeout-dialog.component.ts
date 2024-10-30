import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-session-timeout-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Session Timeout</h2>
    <mat-dialog-content>
      Your session is about to expire. Would you like to stay logged in?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Logout</button>
      <button mat-button [mat-dialog-close]="true" color="primary">Stay Logged In</button>
    </mat-dialog-actions>
  `
})
export class SessionTimeoutDialogComponent {}
