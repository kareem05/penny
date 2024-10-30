import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../store/auth.actions';
import { selectError, selectLoading } from '../store/auth.selectors';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="signup-container">
      <mat-card class="signup-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Please fill in your details</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" type="text">
              <mat-icon matPrefix>person</mat-icon>
              <mat-error *ngIf="signupForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="signupForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="signupForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="signupForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="signupForm.get('password')?.hasError('minlength')">
                Password must be at least 8 characters
              </mat-error>
            </mat-form-field>

            <div *ngIf="error$ | async as error" class="error-message">
              <mat-icon>error</mat-icon>
              {{ error }}
            </div>

            <div class="button-container">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="signupForm.invalid || (loading$ | async)"
                      class="signup-button">
                {{ (loading$ | async) ? 'Creating Account...' : 'Sign Up' }}
              </button>
            </div>

            <div class="form-footer">
              <a mat-button routerLink="/auth/login">Already have an account? Login</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .signup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .signup-card {
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

    .signup-button {
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
    }
  `]
})
export class SignupComponent {
    signupForm: FormGroup;
    hidePassword = true;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;
  
    constructor(
      private fb: FormBuilder,
      private store: Store
    ) {
      this.loading$ = this.store.select(selectLoading);
      this.error$ = this.store.select(selectError);
      this.signupForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      });
    }

    onSubmit() {
      if (this.signupForm.valid) {
        this.store.dispatch(AuthActions.signup(this.signupForm.value));
      }
    }
}