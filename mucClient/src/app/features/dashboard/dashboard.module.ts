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
import { AdHomeComponent } from './admin/ad-home/ad-home.component';
import { AdManageComponent } from './admin/manage/ad-manage/ad-manage.component';
import { AdUsersComponent } from './admin/manage/ad-users/ad-users.component';


@NgModule({
  declarations: [
    UserDashboardComponent,
    SaManageComponent,
    SaHomeComponent,
    SaUsersComponent,
    SaDistributionComponent,
    AdHomeComponent,
    AdManageComponent,
    AdUsersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
