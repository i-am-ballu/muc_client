import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SaHomeComponent } from './superadmin/sa-home/sa-home.component';
import { SaManageComponent } from './superadmin/manage/sa-manage/sa-manage.component';
import { SaUsersComponent } from './superadmin/manage/sa-users/sa-users.component';
import { SaDistributionComponent } from './superadmin/manage/sa-distribution/sa-distribution.component';


const routes: Routes = [
  { path: '', redirectTo: 'user_dashboard', pathMatch: 'full' },
  {
    path: 'user_dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      // Example child routes (lazy load more modules here if needed)
      // { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
    ]
  },
  {
    path: 'sa_dashboard',
    component: SaHomeComponent,
    canActivate: [AuthGuard],
    children: [

    ]
  },
  {
    path: 'sa_manage',
    component: SaManageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        component: SaUsersComponent,
      },
      {
        path: 'distribution',
        component: SaDistributionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
