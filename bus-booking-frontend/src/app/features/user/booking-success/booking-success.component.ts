import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BookingService } from "src/app/core/services/booking.service";
import { Booking, BusDetails, Passenger } from "src/app/core/models/booking.model";

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.scss']
})
export class BookingSuccessComponent implements OnInit {

  booking: Booking | null = null;
  bookingId = '';

  isLoading = true;
  notFound = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.bookingId = params.get('bookingId') || '';

      if (!this.bookingId) {
        this.isLoading = false;
        this.notFound = true;
        return;
      }

      this.loadBooking();
    });
  }

  private loadBooking(): void {
    this.isLoading = true;
    this.notFound = false;
    this.errorMessage = '';

    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: booking => {
        this.booking = booking;
        this.isLoading = false;
      },
      error: error => {
        this.booking = null;
        this.isLoading = false;
        this.notFound = true;
        this.errorMessage = error.error?.message || 'Unable to load booking details.';
      }
    });
  }

  get ticketNumber(): string {
    return this.booking?.bookingId || this.booking?.id || '';
  }

  get busDetails(): BusDetails | null {
    return this.booking?.busDetails || null;
  }

  get passengers(): Passenger[] {
    return this.booking?.passengers || [];
  }

  get primaryPassenger(): Passenger | null {
    return this.passengers[0] || null;
  }

  get seatNumbers(): string[] {
    return this.passengers.map(passenger => passenger.seatNumber);
  }

  get formattedDate(): string {
    const date = this.busDetails?.date;

    if (!date) {
      return '';
    }

    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  get bookedAtFormatted(): string {
    const date = this.booking?.bookingDate;

    if (!date) {
      return '';
    }

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
