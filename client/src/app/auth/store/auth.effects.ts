import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  login$;
  signup$;
  authSuccess$;
  logout$;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(action =>
          this.authService.login(action).pipe(
            map(response => AuthActions.loginSuccess(response)),
            catchError(error => of(AuthActions.loginFailure({ error })))
          )
        )
      )
    );

    this.signup$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.signup),
        switchMap(action =>
          this.authService.signup(action).pipe(
            map(response => AuthActions.signupSuccess(response)),
            catchError(error => of(AuthActions.signupFailure({ error })))
          )
        )
      )
    );

    this.authSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.loginSuccess, AuthActions.signupSuccess),
          tap(action => {
            localStorage.setItem('token', action.token);
            this.router.navigate(['/dashboard']);
          })
        ),
      { dispatch: false }
    );

    this.logout$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logout),
          tap(() => {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          })
        ),
      { dispatch: false }
    );
  }
}