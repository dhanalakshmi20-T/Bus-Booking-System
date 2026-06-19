import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { HomeComponent } from './home/home.component';
import { SearchBusesComponent } from './search-buses/search-buses.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'search', component: SearchBusesComponent },
      { path: 'seat-selection/:busId', component: SeatSelectionComponent },
      { path: 'my-bookings', component: MyBookingsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
