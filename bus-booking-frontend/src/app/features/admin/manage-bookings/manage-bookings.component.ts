import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.scss']
})
export class ManageBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe(data => this.bookings = data);
  }
}
