import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthGuard } from 'src/app/core/auth/auth.guard';


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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
