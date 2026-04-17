import { Routes } from '@angular/router';
import { UsersHomePage } from '../pages/users-home-page/users-home-page';
import { UserDetailPage } from '../pages/user-detail-page/user-detail-page';
import { UserEditPage } from '../pages/user-edit-page/user-edit-page';
import { SkillArchitecturePage } from '../pages/skill-architecture-page/skill-architecture-page';
import { SkillReportPage } from '../pages/skill-architecture-page/skill-report-page/skill-report-page';
import { SkillAreaPageComponent } from '../pages/skill-architecture-page/skill-area-page/skill-area-page.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersHomePage
  },
  {
    path: 'skill-area-page',
    component: SkillAreaPageComponent
  },
  {
    path: 'skill-architecture',
    component: SkillArchitecturePage
  },
  {
    path: 'skill-architecture/report',
    component: SkillReportPage
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