import { Component, OnInit } from '@angular/core';

export interface DashboardStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  bookings: any[] = [];
  users: any[] = [];

  stats: DashboardStat[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }
  
  private loadDashboard(): void {
    this.bookings = JSON.parse(localStorage.getItem('bb_bookings') || '[]');
    this.users = JSON.parse(localStorage.getItem('bb_users') || '[]');

    const confirmed = this.bookings.filter(b => b.status === 'CONFIRMED').length;
    const cancelled = this.bookings.filter(b => b.status === 'CANCELLED').length;
    const revenue = this.bookings.filter(b => b.status === 'CONFIRMED').reduce((sum, b) => sum + Number(b.totalFare || 0), 0);

    this.stats = [
      { label: 'Total Users', value: this.users.length, icon: 'bi-people-fill', color: '#2563eb' },
      { label: 'Total Bookings', value: this.bookings.length, icon: 'bi-ticket-perforated-fill', color: '#7c4dff' },
      { label: 'Confirmed Trips', value: confirmed, icon: 'bi-check-circle-fill', color: '#059669' },
      { label: 'Revenue', value: '₹' + revenue, icon: 'bi-currency-rupee', color: '#f59e0b' }
    ];
  }

  get recentBookings(): any[] {
    return [...this.bookings].sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()).slice(0, 5);
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
