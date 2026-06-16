import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  message = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getMyBookings().subscribe(data => this.bookings = data);
  }

  cancel(id: string): void {
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        this.message = 'Booking cancelled.';
        this.bookings = this.bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b);
      },
      error: (err) => this.message = err.error?.message || 'Cancel failed'
    });
  }
}
