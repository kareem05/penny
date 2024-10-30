// apps/client/src/app/auth/components/forgot-password.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    RouterModule
  ],
  template: `
    <div class="forgot-password-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Reset Password</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="forgotPasswordForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="forgotPasswordForm.invalid || loading">
                {{ loading ? 'Sending...' : 'Reset Password' }}
              </button>
              <button mat-button routerLink="/login">Back to Login</button>
            </div>

            <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

            <div *ngIf="successMessage" class="success-message">
              <mat-icon>check_circle</mat-icon>
              {{ successMessage }}
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    mat-card {
      max-width: 400px;
      width: 100%;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .actions {
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #4caf50;
      padding: 8px;
      background: #e8f5e9;
      border-radius: 4px;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.store.dispatch(AuthActions.forgotPassword({ email: this.forgotPasswordForm.value.email }));
    }
  }
}
