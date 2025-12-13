import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AddBusComponent } from './admin/add-bus/add-bus.component';
import { ViewBusComponent } from './admin/view-bus/view-bus.component';
import { ManageBusesComponent } from './admin/manage-buses/manage-buses.component';
import { EditBusComponent } from './admin/edit-bus/edit-bus.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { SearchBusComponent } from './user/search-bus/search-bus.component';
import { SeatSelectionComponent } from './user/seat-selection/seat-selection.component';
import { BookingSummaryComponent } from './user/booking-summary/booking-summary.component';
import { BookingConfirmationComponent } from './user/booking-confirmation/booking-confirmation.component';
import { BookingHistoryComponent } from './user/booking-history/booking-history.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'admin', component: AdminDashboardComponent,
    children: [
      {path: 'add', component: AddBusComponent},
      {path: 'view', component: ViewBusComponent},
      {path: 'manage', component: ManageBusesComponent},
      {path: 'edit', component: EditBusComponent}
    ]
  },
  {path: 'user', component: UserDashboardComponent,
    children: [
      {path: 'search', component: SearchBusComponent},
      {path: 'seat', component: SeatSelectionComponent},
      {path: 'summary', component: BookingSummaryComponent},
      {path: 'confirm', component: BookingConfirmationComponent},
      {path: 'history', component: BookingHistoryComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
