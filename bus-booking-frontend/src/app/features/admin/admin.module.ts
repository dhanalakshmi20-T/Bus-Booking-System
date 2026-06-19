import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageBusesComponent } from './manage-buses/manage-buses.component';
import { ManageBookingsComponent } from './manage-bookings/manage-bookings.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ReportsComponent } from './reports/reports.component';
import { AdminSettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    ManageBusesComponent,
    ManageBookingsComponent,
    ManageUsersComponent,
    ReportsComponent,
    AdminSettingsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
