import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SaManageComponent } from './superadmin/sa-manage/sa-manage.component';
import { SaHomeComponent } from './superadmin/sa-home/sa-home.component';


@NgModule({
  declarations: [
    UserDashboardComponent,
    SaManageComponent,
    SaHomeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
