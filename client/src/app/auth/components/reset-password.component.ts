// apps/client/src/app/auth/components/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="reset-password-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Reset Your Password</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>New Password</mat-label>
              <input 
                matInput 
                type="password" 
                formControlName="password"
                [type]="hidePassword ? 'password' : 'text'">
              <button 
                mat-icon-button 
                matSuffix 
                (click)="hidePassword = !hidePassword" 
                [attr.aria-label]="'Hide password'" 
                [attr.aria-pressed]="hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="resetForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="resetForm.get('password')?.hasError('minlength')">
                Password must be at least 8 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirm Password</mat-label>
              <input 
                matInput 
                type="password" 
                formControlName="confirmPassword"
                [type]="hideConfirmPassword ? 'password' : 'text'">
              <button 
                mat-icon-button 
                matSuffix 
                (click)="hideConfirmPassword = !hideConfirmPassword" 
                [attr.aria-label]="'Hide password'" 
                [attr.aria-pressed]="hideConfirmPassword">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="resetForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="resetForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="resetForm.invalid || loading">
                {{ loading ? 'Resetting...' : 'Reset Password' }}
              </button>
            </div>

            <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .reset-password-container {
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

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }

    mat-progress-bar {
      margin-top: 16px;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null 
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.loading = true;
      this.store.dispatch(AuthActions.resetPassword({
        token: this.token,
        password: this.resetForm.value.password
      }));
    }
  }
}
