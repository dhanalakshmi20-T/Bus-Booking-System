import { Component, OnInit } from '@angular/core';

export interface AdminBooking {
  bookingId: string;
  busName: string;
  busNumber: string;
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
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  bookedAt: string;
}

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.scss']
})
export class ManageBookingsComponent implements OnInit {

  bookings: AdminBooking[] = [];
  searchText = '';
  statusFilter = 'ALL';

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
    this.bookings = JSON.parse(localStorage.getItem('bb_bookings') || '[]');
    this.bookings.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
  }

  private saveBookings(): void {
    localStorage.setItem('bb_bookings', JSON.stringify(this.bookings));
  }

  get filteredBookings(): AdminBooking[] {
    const term = this.searchText.trim().toLowerCase();

    return this.bookings.filter(booking => {
      const matchesStatus = this.statusFilter === 'ALL' || booking.status === this.statusFilter;
      const matchesSearch = !term ||
        booking.bookingId.toLowerCase().includes(term) ||
        booking.passengerName.toLowerCase().includes(term) ||
        booking.busName.toLowerCase().includes(term) ||
        booking.from.toLowerCase().includes(term) ||
        booking.to.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }

  get confirmedCount(): number {
    return this.bookings.filter(b => b.status === 'CONFIRMED').length;
  }

  get cancelledCount(): number {
    return this.bookings.filter(b => b.status === 'CANCELLED').length;
  }

  get totalRevenue(): number {
    return this.bookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + Number(b.totalFare || 0), 0);
  }

  cancelBooking(booking: AdminBooking): void {
    booking.status = 'CANCELLED';
    this.saveBookings();
  }

  confirmBooking(booking: AdminBooking): void {
    booking.status = 'CONFIRMED';
    this.saveBookings();
  }

  deleteBooking(bookingId: string): void {
    this.bookings = this.bookings.filter(b => b.bookingId !== bookingId);
    this.saveBookings();
  }

  formatDate(date: string): string {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
