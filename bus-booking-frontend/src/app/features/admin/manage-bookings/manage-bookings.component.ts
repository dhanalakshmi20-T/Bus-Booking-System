import { Component, OnInit } from '@angular/core';

import { Booking } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.scss']
})
export class ManageBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  searchText = '';
  statusFilter = 'ALL';
  isLoading = true;
  processingId = '';
  errorMessage = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: bookings => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to load bookings.';
        this.isLoading = false;
      }
    });
  }

  get filteredBookings(): Booking[] {
    const term = this.searchText.trim().toLowerCase();
    return this.bookings.filter(booking => {
      const bus = booking.busDetails;
      const passenger = booking.passengers[0];
      const matchesStatus = this.statusFilter === 'ALL' || booking.status === this.statusFilter;
      const searchable = [
        booking.bookingId || booking.id,
        passenger?.name,
        booking.userDetails?.email,
        bus?.busName,
        bus?.from,
        bus?.to
      ].join(' ').toLowerCase();
      return matchesStatus && (!term || searchable.includes(term));
    });
  }

  get confirmedCount(): number {
    return this.bookings.filter(booking => booking.status === 'CONFIRMED').length;
  }

  get cancelledCount(): number {
    return this.bookings.filter(booking => booking.status === 'CANCELLED').length;
  }

  get totalRevenue(): number {
    return this.bookings
      .filter(booking => booking.status === 'CONFIRMED')
      .reduce((sum, booking) => sum + booking.totalFare, 0);
  }

  cancelBooking(booking: Booking): void {
    this.runAction(booking, 'CANCELLED');
  }

  confirmBooking(booking: Booking): void {
    this.runAction(booking, 'CONFIRMED');
  }

  private runAction(booking: Booking, status: 'CONFIRMED' | 'CANCELLED'): void {
    this.processingId = booking.id;
    this.errorMessage = '';
    const request = status === 'CONFIRMED'
      ? this.bookingService.confirmBooking(booking.id)
      : this.bookingService.cancelBooking(booking.id);

    request.subscribe({
      next: response => {
        this.bookings = this.bookings.map(item =>
          item.id === booking.id
            ? { ...item, ...response.booking, status }
            : item
        );
        this.processingId = '';
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to update booking.';
        this.processingId = '';
      }
    });
  }

  deleteBooking(booking: Booking): void {
    if (!window.confirm('Delete this booking permanently?')) return;
    this.processingId = booking.id;
    this.bookingService.deleteBooking(booking.id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(item => item.id !== booking.id);
        this.processingId = '';
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to delete booking.';
        this.processingId = '';
      }
    });
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
