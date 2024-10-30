// apps/client/src/app/auth/store/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: any; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);

export const signupSuccess = createAction(
  '[Auth] Signup Success',
  props<{ user: any; token: string }>()
);

export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');
export const resetPassword = createAction(
    '[Auth] Reset Password',
    props<{ token: string; password: string }>()
  );
  
  export const resetPasswordSuccess = createAction(
    '[Auth] Reset Password Success'
  );
  
  export const resetPasswordFailure = createAction(
    '[Auth] Reset Password Failure',
    props<{ error: any }>()
  );

export const forgotPassword = createAction(
  '[Auth] Forgot Password Request',
  props<{ email: string }>()
);

export const forgotPasswordSuccess = createAction(
  '[Auth] Forgot Password Success'
);

export const forgotPasswordFailure = createAction(
  '[Auth] Forgot Password Failure',
  props<{ error: any }>()
);
