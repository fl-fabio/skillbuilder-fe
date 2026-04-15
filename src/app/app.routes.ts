import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/pages/login-page/login-page').then((m) => m.LoginPage)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./auth/pages/register-page/register-page').then((m) => m.RegisterPage)
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./routes/users.routes').then((m) => m.USERS_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'users'
  }
];
