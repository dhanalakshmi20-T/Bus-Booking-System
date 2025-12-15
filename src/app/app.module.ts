import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBusComponent } from './user/search-bus/search-bus.component';
import { SeatSelectionComponent } from './user/seat-selection/seat-selection.component';
import { BookingSummaryComponent } from './user/booking-summary/booking-summary.component';
import { BookingConfirmationComponent } from './user/booking-confirmation/booking-confirmation.component';
import { BookingHistoryComponent } from './user/booking-history/booking-history.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ManageBusesComponent } from './admin/manage-buses/manage-buses.component';
import { AddBusComponent } from './admin/add-bus/add-bus.component';
import { ViewBusComponent } from './admin/view-bus/view-bus.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchBusComponent,
    SeatSelectionComponent,
    BookingSummaryComponent,
    BookingConfirmationComponent,
    BookingHistoryComponent,
    AdminDashboardComponent,
    ManageBusesComponent,
    AddBusComponent,
    ViewBusComponent,
    UserDashboardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
