// client/src/app/auth/store/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuth,
  (state) => state.user
);

export const selectToken = createSelector(
  selectAuth,
  (state) => state.token
);

export const selectLoading = createSelector(
  selectAuth,
  (state) => state.loading
);

export const selectError = createSelector(
  selectAuth,
  (state) => state.error
);

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (state) => !!state.token
);