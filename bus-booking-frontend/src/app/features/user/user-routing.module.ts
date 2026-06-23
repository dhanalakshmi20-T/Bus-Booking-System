import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { SearchBusesComponent } from './search-buses/search-buses.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'search-buses', component: SearchBusesComponent, canActivate: [AuthGuard] },
      { path: 'seat-selection/:busId', component: SeatSelectionComponent, canActivate: [AuthGuard] },
      { path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
      { path: 'booking-success', component: BookingSuccessComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] }
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
