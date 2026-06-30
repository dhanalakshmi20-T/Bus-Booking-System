import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Booking } from '../../../core/models/booking.model';
import { UserSummary } from '../../../core/models/user.model';
import { BookingService } from '../../../core/services/booking.service';
import { UserService } from '../../../core/services/user.service';

interface DashboardStat { label: string; value: string | number; icon: string; color: string; }

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class DashboardComponent implements OnInit {
  bookings: Booking[] = [];
  users: UserSummary[] = [];
  stats: DashboardStat[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private bookingService: BookingService, private userService: UserService) {}

  ngOnInit(): void {
    forkJoin({ bookings: this.bookingService.getAllBookings(), users: this.userService.getAllUsers() }).subscribe({
      next: result => {
        this.bookings = result.bookings;
        this.users = result.users;
        this.buildStats();
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to load dashboard.';
        this.isLoading = false;
      }
    });
  }

  private buildStats(): void {
    const confirmed = this.bookings.filter(item => item.status === 'CONFIRMED');
    const revenue = confirmed.reduce((sum, item) => sum + item.totalFare, 0);
    this.stats = [
      { label: 'Total Users', value: this.users.length, icon: 'bi-people-fill', color: '#2563eb' },
      { label: 'Total Bookings', value: this.bookings.length, icon: 'bi-ticket-perforated-fill', color: '#7c4dff' },
      { label: 'Confirmed Trips', value: confirmed.length, icon: 'bi-check-circle-fill', color: '#059669' },
      { label: 'Revenue', value: `₹${revenue}`, icon: 'bi-currency-rupee', color: '#f59e0b' }
    ];
  }

  get recentBookings(): Booking[] {
    return [...this.bookings].sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()).slice(0, 5);
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
