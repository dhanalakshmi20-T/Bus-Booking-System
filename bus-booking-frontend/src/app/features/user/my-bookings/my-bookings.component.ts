import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Booking {
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
  status: string;
  bookedAt: string;
}

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {

  allBookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  activeFilter = 'ALL';
  cancellingId = '';

  filters = ['ALL', 'CONFIRMED', 'CANCELLED'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
    const raw = localStorage.getItem('bb_bookings');
    this.allBookings = raw ? JSON.parse(raw) : [];
    this.allBookings.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'ALL') {
      this.filteredBookings = [...this.allBookings];
    }
    else {
      this.filteredBookings = this.allBookings.filter(b => b.status === this.activeFilter);
    }
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  cancelBooking(bookingId: string): void {
    this.cancellingId = bookingId;
    setTimeout(() => {
      this.allBookings = this.allBookings.map(b => b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b);
      localStorage.setItem('bb_bookings', JSON.stringify(this.allBookings));
      this.cancellingId = '';
    }, 800);
  }

  viewTicket(bookingId: string): void {
    this.router.navigate(['/booking-success'], {
      queryParams: { bookingId }
    });
  }

  searchBuses(): void {
    this.router.navigate(['/search-buses']);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  formatBookedAt(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  get confirmedCount(): number {
    return this.allBookings.filter(b => b.status === 'CONFIRMED').length;
  }

  get cancelledCount(): number {
    return this.allBookings.filter(b => b.status === 'CANCELLED').length;
  }

  get totalSpent(): number {
    return this.allBookings.filter(b => b.status === 'CONFIRMED').reduce((sum, b) => sum + b.totalFare, 0);
  }

  isUpcoming(dateStr: string): boolean {
    return new Date(dateStr) >= new Date;
  }
}
