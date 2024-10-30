// apps/client/src/app/dashboard/components/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as DashboardActions from '../store/dashboard.actions';
import { DashboardState } from '../store/dashboard.reducer';
import { AuthState } from '../../auth/store/auth.reducer';
import { selectUser } from '../../auth/store/auth.selectors';

interface AppState {
  dashboard: DashboardState;
  auth: AuthState;
}

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

// Component Imports
import { UsersListComponent } from './users-list/users-list.component';
import { ProductsListComponent } from './products-list/products-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    UsersListComponent,
    ProductsListComponent
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary">
        <span>Dashboard</span>
        <span class="spacer"></span>
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ (currentUser$ | async)?.name }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <div class="content-container">
        <mat-tab-group>
          <mat-tab label="Users">
            <ng-template matTabContent>
              <app-users-list
                [users]="(users$ | async) || []"
                [loading]="(loading$ | async) || false"
                [error]="error$ | async"
                (retry)="loadUsers()">
              </app-users-list>
            </ng-template>
          </mat-tab>

          <mat-tab label="Products">
            <ng-template matTabContent>
              <app-products-list
                [products]="(products$ | async) || []"
                [loading]="(loading$ | async) || false"
                [error]="error$ | async"
                (retry)="loadProducts()">
              </app-products-list>
            </ng-template>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  users$: Observable<any[]>;
  products$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  currentUser$: Observable<any>;

  constructor(private store: Store<AppState>) {
    this.users$ = this.store.select(state => state.dashboard?.users ?? []);
    this.products$ = this.store.select(state => state.dashboard?.products ?? []);
    this.loading$ = this.store.select(state => state.dashboard?.loading ?? false);
    this.error$ = this.store.select(state => state.dashboard?.error ?? null);
    this.currentUser$ = this.store.select(selectUser);
  }

  ngOnInit() {
    this.loadUsers();
    this.loadProducts();
  }

  loadUsers() {
    this.store.dispatch(DashboardActions.loadUsers());
  }

  loadProducts() {
    this.store.dispatch(DashboardActions.loadProducts());
  }

  logout() {
    this.store.dispatch({ type: '[Auth] Logout' });
  }
}
