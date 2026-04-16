import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { ErrorPage } from './pages/error-page/error-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    component: LoginPage
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    component: RegisterPage
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./routes/users.routes').then((m) => m.USERS_ROUTES)
  },
  {
    path: '404',
    component: ErrorPage
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
