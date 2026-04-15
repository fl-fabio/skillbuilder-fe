import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { LoginPage } from './auth/pages/login-page/login-page';
import { RegisterPage } from './auth/pages/register-page/register-page';
import { ChoiceAreaPage } from './pages/choice-area-page/choice-area-page';
import { ErrorPage } from './pages/error-page/error-page';

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
    path: 'choice-area',
    canActivate: [guestGuard],
    component: ChoiceAreaPage
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
