import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

interface UserSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  bookingReminders: boolean;
  promoOffers: boolean;
  language: string;
  currency: string;
  theme: string;
}

@Component({ selector: 'app-settings', templateUrl: './settings.component.html', styleUrls: ['./settings.component.scss'] })
export class SettingsComponent implements OnInit {
  settings: UserSettings = {
    emailAlerts: true,
    smsAlerts: true,
    bookingReminders: true,
    promoOffers: false,
    language: 'English',
    currency: 'INR',
    theme: 'Light'
  };
  password = { current: '', newPassword: '', confirmPassword: '' };
  saveSuccess = false;
  passwordSuccess = false;
  isChangingPassword = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem('bb_settings');
      if (raw) this.settings = { ...this.settings, ...JSON.parse(raw) };
    } catch {
      localStorage.removeItem('bb_settings');
    }
  }

  saveSettings(): void {
    localStorage.setItem('bb_settings', JSON.stringify(this.settings));
    this.errorMessage = '';
    this.saveSuccess = true;
    setTimeout(() => this.saveSuccess = false, 3000);
  }

  changePassword(): void {
    this.errorMessage = '';
    this.passwordSuccess = false;
    if (!this.password.current || !this.password.newPassword || !this.password.confirmPassword) {
      this.errorMessage = 'Please fill all password fields.';
      return;
    }
    if (this.password.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters.';
      return;
    }
    if (this.password.newPassword !== this.password.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    this.isChangingPassword = true;
    this.authService.changePassword(this.password.current, this.password.newPassword).subscribe({
      next: () => {
        this.password = { current: '', newPassword: '', confirmPassword: '' };
        this.isChangingPassword = false;
        this.passwordSuccess = true;
        setTimeout(() => this.passwordSuccess = false, 3000);
      },
      error: error => {
        this.isChangingPassword = false;
        this.errorMessage = error.error?.message || 'Unable to change password.';
      }
    });
  }
}
