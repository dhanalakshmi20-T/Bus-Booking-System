import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface BookingDetail {
  bookingId: string;
  busName: string;
  busNumber: string;
  busType?: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  totalFare: number;
  passengerName: string;
  passengerAge: string;
  passengerGender: string;
  mobileNumber: string;
  status: string;
  bookedAt: string;
}

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.scss']
})
export class BookingSuccessComponent implements OnInit {

  booking: BookingDetail | null = null;
  bookingId = '';
  notFound = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'] || '';
      this.loadBooking();
    });
  }

  private loadBooking(): void {
    if (!this.bookingId) {
      this.notFound = true;
      return;
    }
    const all = JSON.parse(localStorage.getItem('bb_bookings') || '[]');
    const found = all.find((b: BookingDetail) => b.bookingId === this.bookingId);
    if (found) {
      this.booking = found;
    }
    else {
      this.notFound = true;
    }
  }

  get formattedDate(): string {
    if (!this.booking?.date) return '';
    const d = new Date(this.booking.date);
    return d.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  get bookedAtFormatted(): string {
    if (!this.booking?.bookedAt) return '';
    const d = new Date(this.booking.bookedAt);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  printTicket(): void {
    window.print();
  }
}
