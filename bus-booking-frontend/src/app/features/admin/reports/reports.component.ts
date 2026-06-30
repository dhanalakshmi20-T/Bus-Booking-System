import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Booking } from '../../../core/models/booking.model';
import { UserSummary } from '../../../core/models/user.model';
import { BookingService } from '../../../core/services/booking.service';
import { UserService } from '../../../core/services/user.service';

interface RouteReport { route: string; bookings: number; revenue: number; }

@Component({ selector: 'app-reports', templateUrl: './reports.component.html', styleUrls: ['./reports.component.scss'] })
export class ReportsComponent implements OnInit {
  bookings: Booking[] = [];
  users: UserSummary[] = [];
  routeReports: RouteReport[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private bookingService: BookingService, private userService: UserService) {}

  ngOnInit(): void {
    forkJoin({ bookings: this.bookingService.getAllBookings(), users: this.userService.getAllUsers() }).subscribe({
      next: result => {
        this.bookings = result.bookings;
        this.users = result.users;
        this.buildRouteReports();
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to load reports.';
        this.isLoading = false;
      }
    });
  }

  private buildRouteReports(): void {
    const reports = new Map<string, RouteReport>();
    this.bookings.filter(item => item.status === 'CONFIRMED').forEach(booking => {
      const route = `${booking.busDetails?.from || 'Unknown'} to ${booking.busDetails?.to || 'Unknown'}`;
      const report = reports.get(route) || { route, bookings: 0, revenue: 0 };
      report.bookings++;
      report.revenue += booking.totalFare;
      reports.set(route, report);
    });
    this.routeReports = Array.from(reports.values()).sort((a, b) => b.revenue - a.revenue);
  }

  get totalBookings(): number { return this.bookings.length; }
  get confirmedBookings(): number { return this.bookings.filter(item => item.status === 'CONFIRMED').length; }
  get cancelledBookings(): number { return this.bookings.filter(item => item.status === 'CANCELLED').length; }
  get totalRevenue(): number { return this.bookings.filter(item => item.status === 'CONFIRMED').reduce((sum, item) => sum + item.totalFare, 0); }
  get averageFare(): number { return this.confirmedBookings ? Math.round(this.totalRevenue / this.confirmedBookings) : 0; }
  get cancellationRate(): number { return this.totalBookings ? Math.round(this.cancelledBookings / this.totalBookings * 100) : 0; }
  get topRoute(): string { return this.routeReports[0]?.route || '-'; }
}
