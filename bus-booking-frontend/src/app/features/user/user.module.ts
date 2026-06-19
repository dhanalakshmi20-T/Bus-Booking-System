import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { UserLayoutComponent } from './user-layout/user-layout.component';
import { HomeComponent } from './home/home.component';
import { SearchBusesComponent } from './search-buses/search-buses.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    UserLayoutComponent,
    HomeComponent,
    SearchBusesComponent,
    SeatSelectionComponent,
    MyBookingsComponent,
    ProfileComponent,
    NotificationsComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
