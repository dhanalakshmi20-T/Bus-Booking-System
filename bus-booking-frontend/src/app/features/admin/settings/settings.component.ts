import { Component, OnInit } from '@angular/core';

export interface AdminSettings {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  cancellationWindow: number;
  serviceFee: number;
  maintenanceMode: boolean;
  autoConfirmBookings: boolean;
  emailNotifications: boolean;
}

@Component({
  selector: 'app-admin-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  settings: AdminSettings = {
    platformName: 'BusBook',
    supportEmail: 'support@busbook.com',
    supportPhone: '+91 9876543210',
    cancellationWindow: 2,
    serviceFee: 20,
    maintenanceMode: false,
    autoConfirmBookings: true,
    emailNotifications: true
  };

  saveSuccess = false;

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    const saved = localStorage.getItem('bb_admin_settings');

    if (saved) {
      this.settings = {
        ...this.settings,
        ...JSON.parse(saved)
      };
    }
  }

  saveSettings(): void {
    localStorage.setItem('bb_admin_settings', JSON.stringify(this.settings));
    this.saveSuccess = true;

    setTimeout(() => this.saveSuccess = false, 3000);
  }

  resetSettings(): void {
    localStorage.removeItem('bb_admin_settings');

    this.settings = {
      platformName: 'BusBook',
      supportEmail: 'support@busbook.com',
      supportPhone: '+91 9876543210',
      cancellationWindow: 2,
      serviceFee: 20,
      maintenanceMode: false,
      autoConfirmBookings: true,
      emailNotifications: true
    };

    this.saveSuccess = false;
  }
}
