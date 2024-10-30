// client/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/components/dashboard.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/auth/login', 
    pathMatch: 'full' 
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    redirectTo: '/auth/login' 
  }
];