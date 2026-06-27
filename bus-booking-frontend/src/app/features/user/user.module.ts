import { NgModule } from "@angular/core";
import { UserLayoutComponent } from "./user-layout/user-layout.component";
import { LandingComponent } from "./landing/landing.component";
import { HomeComponent } from "./home/home.component";
import { SearchBusesComponent } from "./search-buses/search-buses.component";
import { SeatSelectionComponent } from "./seat-selection/seat-selection.component";
import { MyBookingsComponent } from "./my-bookings/my-bookings.component";
import { BookingSuccessComponent } from "./booking-success/booking-success.component";
import { ProfileComponent } from "./profile/profile.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { SettingsComponent } from "./settings/settings.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { UserRoutingModule } from "./user-routing.module";

@NgModule({
  declarations: [
    UserLayoutComponent,
    LandingComponent,
    HomeComponent,
    SearchBusesComponent,
    SeatSelectionComponent,
    MyBookingsComponent,
    BookingSuccessComponent,
    ProfileComponent,
    NotificationsComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule {}