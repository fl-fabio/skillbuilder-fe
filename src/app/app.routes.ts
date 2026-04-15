import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { UserDetailPage } from './pages/user-detail-page/user-detail-page';
import { UserEditPage } from './pages/user-edit-page/user-edit-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users'
  },
  {
    path: 'users:id',
    component: UserDetailPage
  },
  {
    path: ':id/edit',
    component: UserEditPage
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: '**',
    redirectTo: 'users'
  }
];