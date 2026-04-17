import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { ErrorPage } from './pages/error-page/error-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { ChoiceAreaPage } from './pages/choice-area/choice-area';
import { JobTitlePage } from './pages/job-title-page/job-title-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'choice-area',
    canActivate: [guestGuard],
    component: ChoiceAreaPage
  },
  {
    path: 'job-title',
    component: JobTitlePage
  },
  {
    path: 'profile',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./profile/pages/profile-edit-page/profile-edit-page').then(
        (m) => m.ProfileEditPage
      )
  },
  {
    path: 'analysis-report',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./analysis/pages/analysis-report-page/analysis-report-page').then(
        (m) => m.AnalysisReportPage
      )
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
