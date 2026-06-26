import { Component, OnInit } from '@angular/core';

export interface RouteReport {
  route: string;
  bookings: number;
  revenue: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  bookings: any[] = [];
  users: any[] = [];
  routeReports: RouteReport[] = [];

  ngOnInit(): void {
    this.loadReports();
  }

  private loadReports(): void {
    this.bookings = JSON.parse(localStorage.getItem('bb_bookings') || '[]');
    this.users = JSON.parse(localStorage.getItem('bb_users') || '[]');
    this.buildRouteReports();
  }

  private buildRouteReports(): void {
    const reportMap: { [route: string]: RouteReport } = {};

    this.bookings.filter(booking => booking.status === 'CONFIRMED')
      .forEach(booking => {
        const route = `${booking.from} to ${booking.to}`;

        if (!reportMap[route]) {
          reportMap[route] = {
            route,
            bookings: 0,
            revenue: 0
          };
        }

        reportMap[route].bookings++;
        reportMap[route].revenue += Number(booking.totalFare || 0);
      });

    this.routeReports = Object.values(reportMap)
      .sort((a, b) => b.revenue - a.revenue);
  }

  get totalBookings(): number {
    return this.bookings.length;
  }

  get confirmedBookings(): number {
    return this.bookings.filter(booking => booking.status === 'COMFIRMED').length;
  }

  get cancelledBookings(): number {
    return this.bookings.filter(booking => booking.status === 'CANCELLED').length;
  }

  get totalRevenue(): number {
    return this.bookings.filter(booking => booking.status === 'CONFIRMED')
      .reduce((sum, booking) => sum + Number(booking.totalFare || 0), 0);
  }

  get averageFare(): number {
    if (this.confirmedBookings === 0) return 0;
    return Math.round(this.totalRevenue / this.confirmedBookings);
  }

  get cancellationRate(): number {
    if (this.totalBookings === 0) return 0;
    return Math.round((this.cancelledBookings / this.totalBookings) * 100);
  }

  get topRoute(): string {
    return this.routeReports.length ? this.routeReports[0].route : '-';
  }
}
