import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as DashboardActions from './dashboard.actions';
import { DashboardService } from '../services/dashboard.service';

@Injectable()
export class DashboardEffects {
  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(DashboardActions.loadUsers),
    mergeMap(() => this.dashboardService.getUsers()
      .pipe(
        map((users: any[]) => DashboardActions.loadUsersSuccess({ users })),
        catchError(error => of(DashboardActions.loadUsersFailure({ error })))
      ))
  ));

  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(DashboardActions.loadProducts),
    mergeMap(() => this.dashboardService.getProducts()
      .pipe(
        map((products: any[]) => DashboardActions.loadProductsSuccess({ products })),
        catchError(error => of(DashboardActions.loadProductsFailure({ error })))
      ))
  ));

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) {}
}
