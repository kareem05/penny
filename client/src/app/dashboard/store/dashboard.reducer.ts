// apps/client/src/app/dashboard/store/dashboard.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';

export interface DashboardState {
  users: any[];
  products: any[];
  loading: boolean;
  error: any;
}

export const initialState: DashboardState = {
  users: [],
  products: [],
  loading: false,
  error: null
};

export const dashboardReducer = createReducer(
  initialState,
  on(DashboardActions.loadUsers, state => ({
    ...state,
    loading: true
  })),
  on(DashboardActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  })),
  on(DashboardActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(DashboardActions.loadProducts, state => ({
    ...state,
    loading: true
  })),
  on(DashboardActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),
  on(DashboardActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);