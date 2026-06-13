import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageBusesComponent } from './manage-buses/manage-buses.component';
import { ManageBookingsComponent } from './manage-bookings/manage-bookings.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ManageBusesComponent,
    ManageBookingsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
