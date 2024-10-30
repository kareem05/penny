// apps/client/src/app/dashboard/store/dashboard.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction('[Dashboard] Load Users');
export const loadUsersSuccess = createAction(
  '[Dashboard] Load Users Success',
  props<{ users: any[] }>()
);
export const loadUsersFailure = createAction(
  '[Dashboard] Load Users Failure',
  props<{ error: any }>()
);

export const loadProducts = createAction('[Dashboard] Load Products');
export const loadProductsSuccess = createAction(
  '[Dashboard] Load Products Success',
  props<{ products: any[] }>()
);
export const loadProductsFailure = createAction(
  '[Dashboard] Load Products Failure',
  props<{ error: any }>()
);