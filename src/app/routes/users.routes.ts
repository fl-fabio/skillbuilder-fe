import { Routes } from '@angular/router';
import { UsersHomePage } from '../pages/users-home-page/users-home-page';
import { UserDetailPage } from '../pages/user-detail-page/user-detail-page';
import { UserEditPage } from '../pages/user-edit-page/user-edit-page';


export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersHomePage
  },
  {
    path: ':id',
    component: UserDetailPage
  },
  {
    path: ':id/edit',
    component: UserEditPage
  }
];