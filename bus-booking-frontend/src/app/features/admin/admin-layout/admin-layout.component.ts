import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

export interface AdminNavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {

  sidebarOpen = false;

  navItems: AdminNavItem[] = [
    { label: 'Dashboard', icon: 'bi-speedometer2', route: '/admin/dashboard' },
    { label: 'Manage Buses', icon: 'bi-bus-front-fill', route: '/admin/manage-buses' },
    { label: 'Manage Bookings', icon: 'bi-ticket-perforated-fill', route: '/admin/manage-bookings' },
    { label: 'Manage Users', icon: 'bi-people-fill', route: '/admin/manage-users' },
    { label: 'Reports', icon: 'bi-bar-chart-fill', route: '/admin/reports' },
    { label: 'Settings', icon: 'bi-gear-fill', route: '/admin/settings' }
  ];

  constructor(private authService: AuthService) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
