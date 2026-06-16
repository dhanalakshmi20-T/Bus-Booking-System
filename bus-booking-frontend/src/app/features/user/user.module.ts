import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { SearchBusesComponent } from './search-buses/search-buses.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    SearchBusesComponent,
    SeatSelectionComponent,
    MyBookingsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UserModule { }
