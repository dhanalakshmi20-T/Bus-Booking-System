import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchBusesComponent } from './search-buses/search-buses.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchBusesComponent },
  { path: 'seat-selection/:busId', component: SeatSelectionComponent },
  { path: 'my-bookings', component: MyBookingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
