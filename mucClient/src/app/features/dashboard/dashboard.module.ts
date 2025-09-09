import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SaManageComponent } from './superadmin/manage/sa-manage/sa-manage.component';
import { SaHomeComponent } from './superadmin/sa-home/sa-home.component';
import { SaUsersComponent } from './superadmin/manage/sa-users/sa-users.component';
import { SaDistributionComponent } from './superadmin/manage/sa-distribution/sa-distribution.component';


@NgModule({
  declarations: [
    UserDashboardComponent,
    SaManageComponent,
    SaHomeComponent,
    SaUsersComponent,
    SaDistributionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
