import { Component, OnInit } from '@angular/core';

export interface UserSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  bookingReminders: boolean;
  promoOffers: boolean;
  language: string;
  currency: string;
  theme: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
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

  password = {
    current: '',
    newPassword: '',
    confirmPassword: ''
  };

  saveSuccess = false;
  passwordSuccess = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    const raw = localStorage.getItem('bb_settings');
    if (raw) {
      this.settings = { ...this.settings, ...JSON.parse(raw) };
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

    if (!this.password.current || this.password.newPassword || !this.password.confirmPassword) {
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

    const currentUser = JSON.parse(localStorage.getItem('bb_current') || '{}');
    const users: any[] = JSON.parse(localStorage.getItem('bb_users') || '[]');
    const index = users.findIndex(user => user.email === currentUser.email);

    if (index === -1 || users[index].password !== this.password.current) {
      this.errorMessage = 'Current password is incorrect.';
      return;
    }

    users[index].password = this.password.newPassword;
    localStorage.setItem('bb_users', JSON.stringify(users));

    this.password = {
      current: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    this.passwordSuccess = true;
    setTimeout(() => this.passwordSuccess = false, 3000);
  }
}
