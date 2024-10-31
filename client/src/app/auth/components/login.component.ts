// apps/client/src/app/auth/components/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth.actions';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { selectError } from '../store/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Welcome Back</mat-card-title>
          <mat-card-subtitle>Please sign in to continue</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" data-testid="email-input">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div *ngIf="error$ | async as error" class="error-message">
              <mat-icon>error</mat-icon>
              {{ error }}
            </div>

            <div class="button-container">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="loginForm.invalid || loading"
                      data-testid="login-button"
                      class="login-button">
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>
            </div>

            <div class="form-footer">
              <a mat-button routerLink="/auth/forgot-password">Forgot Password?</a>
              <a mat-button routerLink="/auth/signup">Don't have an account? Sign up</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
    }

    mat-card-header {
      margin-bottom: 20px;
      text-align: center;
    }

    mat-card-title {
      font-size: 24px;
      margin-bottom: 8px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .button-container {
      margin-top: 16px;
    }

    .login-button {
      width: 100%;
      padding: 8px;
      font-size: 16px;
    }

    .form-footer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
      text-align: center;
    }

    .form-footer a {
      text-decoration: none;
      color: #1976d2;
    }

    mat-form-field {
      width: 100%;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  error$ = this.store.select(selectError);

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Subscribe to error state to reset loading
    this.error$.subscribe(error => {
      if (error) {
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.store.dispatch(AuthActions.login(this.loginForm.value));
    }
  }
}
