import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageBusesComponent } from './manage-buses/manage-buses.component';
import { ManageBookingsComponent } from './manage-bookings/manage-bookings.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage-buses', component: ManageBusesComponent },
  { path: 'manage-bookings', component: ManageBookingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
