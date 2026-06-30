import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Booking } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';

type BookingFilter =
  'ALL' |
  'CONFIRMED' |
  'CANCELLED';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {

  allBookings: Booking[] = [];
  filteredBookings: Booking[] = [];

  filters: BookingFilter[] = [
    'ALL',
    'CONFIRMED',
    'CANCELLED'
  ];

  activeFilter: BookingFilter = 'ALL';
  cancellingId = '';

  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.getMyBookings().subscribe({
      next: bookings => {
        this.allBookings = bookings;
        this.applyFilter();
        this.isLoading = false;
      },
      error: error => {
        this.allBookings = [];
        this.filteredBookings = [];
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          'Unable to load your bookings.';
      }
    });
  }

  applyFilter(): void {
    if (this.activeFilter === 'ALL') {
      this.filteredBookings = [...this.allBookings];
      return;
    }

    this.filteredBookings = this.allBookings.filter(
      booking => booking.status === this.activeFilter
    );
  }

  setFilter(filter: BookingFilter): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  cancelBooking(booking: Booking): void {
    if (booking.status === 'CANCELLED') {
      return;
    }

    this.cancellingId = booking.id;
    this.errorMessage = '';

    this.bookingService
      .cancelBooking(booking.id)
      .subscribe({
        next: response => {
          const updatedBooking = response.booking;

          this.allBookings = this.allBookings.map(item =>
            item.id === booking.id
              ? {
                  ...item,
                  ...updatedBooking,
                  status: 'CANCELLED'
                }
              : item
          );

          this.cancellingId = '';
          this.applyFilter();
        },
        error: error => {
          this.cancellingId = '';
          this.errorMessage =
            error.error?.message ||
            'Unable to cancel this booking.';
        }
      });
  }

  viewTicket(booking: Booking): void {
    this.router.navigate(['/booking-success'], {
      queryParams: {
        bookingId: booking.bookingId || booking.id
      }
    });
  }

  searchBuses(): void {
    this.router.navigate(['/search-buses']);
  }

  getSeatNumbers(booking: Booking): string[] {
    return booking.passengers.map(
      passenger => passenger.seatNumber
    );
  }

  getPassengerName(booking: Booking): string {
    return booking.passengers[0]?.name || '-';
  }

  formatDate(date: string | undefined): string {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatBookedAt(date: string): string {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get confirmedCount(): number {
    return this.allBookings.filter(
      booking => booking.status === 'CONFIRMED'
    ).length;
  }

  get cancelledCount(): number {
    return this.allBookings.filter(
      booking => booking.status === 'CANCELLED'
    ).length;
  }

  get totalSpent(): number {
    return this.allBookings
      .filter(booking => booking.status === 'CONFIRMED')
      .reduce(
        (total, booking) => total + booking.totalFare,
        0
      );
  }

  isUpcoming(date: string | undefined): boolean {
    if (!date) {
      return false;
    }

    return new Date(date).getTime() >= Date.now();
  }
}