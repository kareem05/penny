// apps/client/src/app/auth/store/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  // Signup
  on(AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.signupSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null
  })),
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message || 'An error occurred during signup'
  })),

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message || 'An error occurred during login'
  })),

  // Logout
  on(AuthActions.logout, () => ({
    ...initialState
  })),

  // Reset Password
  on(AuthActions.resetPassword, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.resetPasswordSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message || 'An error occurred during password reset'
  })),

  // Forgot Password
  on(AuthActions.forgotPassword, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.forgotPasswordSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message || 'An error occurred during password recovery'
  }))
);