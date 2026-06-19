import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageBusesComponent } from './manage-buses/manage-buses.component';
import { ManageBookingsComponent } from './manage-bookings/manage-bookings.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ReportsComponent } from './reports/reports.component';
import { AdminSettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'manage-buses', component: ManageBusesComponent },
      { path: 'manage-bookings', component: ManageBookingsComponent },
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
