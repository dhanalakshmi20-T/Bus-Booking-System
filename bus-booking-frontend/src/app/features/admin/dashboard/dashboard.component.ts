import { Component, OnInit } from '@angular/core';
import { BusService } from '../../../core/services/bus.service';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalBuses = 0;
  totalBookings = 0;

  constructor(private busService: BusService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.busService.getAllBuses().subscribe(data => this.totalBuses = data.length);
    this.bookingService.getAllBookings().subscribe(data => this.totalBookings = data.length);
  }
}
