import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  address: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: UserProfile = {
    name: '', email: '', mobile: '', dob: '', gender: 'male', address: ''
  };

  editMode = false;
  saving  = false;
  saveSuccess = false;
  errorMessage = '';
  totalBookings = 0;
  confirmedBookings = 0;
  cancelledBookings = 0;
  totalSpent = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadStats();
  }

  private loadProfile(): void {
    const current = localStorage.getItem('bb_current');
    if (current) {
      const user = JSON.parse(current);
      this.profile = {
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        dob: user.dob || '',
        gender: user.gender || '',
        address: user.address || ''
      };
    }
  }

  private loadStats(): void {
    const raw = localStorage.getItem('bb_bookings');
    const bookings = raw ? JSON.parse(raw) : [];
    this.totalBookings = bookings.length;
    this.confirmedBookings = bookings.filter((b: any) => b.status === 'CONFIRMED').length;
    this.cancelledBookings = bookings.filter((b: any) => b.status === 'CANCELLED').length;
    this.totalSpent = bookings.filter((b: any) => b.status === 'CONFIRMED').reduce((sum: number, b: any) => sum + b.totalFare, 0)
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    this.saveSuccess = false;
    this.errorMessage = '';
  }

  saveProfile(): void {
    this.errorMessage = '';

    if (!this.profile.name.trim()) {
      this.errorMessage = 'Name is required.';
      return;
    }
    if (this.profile.mobile && this.profile.mobile.length !== 10) {
      this.errorMessage = 'Enter a valid 10-digit mobile number.';
      return;
    }

    this.saving = true;
    setTimeout(() => {
      const current = JSON.parse(localStorage.getItem('bb_current') || '{}');
      const updated = { ...current, ...this.profile };
      localStorage.setItem('bb_current', JSON.stringify(updated));

      const users: any[] = JSON.parse(localStorage.getItem('bb_users') || '[]');
      const idx = users.findIndex(u => u.email === this.profile.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...this.profile };
        localStorage.setItem('bb_users', JSON.stringify(users));
      }

      this.saving = false;
      this.editMode = false;
      this.saveSuccess = true;
      setTimeout(() => this.saveSuccess = false, 3000);
    }, 800);
  }

  cancelEdit(): void {
    this.loadProfile();
    this.editMode = false;
    this.errorMessage = '';
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  get avatarInitials(): string {
    const words = this.profile.name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return this.profile.name.slice(0, 2).toUpperCase() || 'U';
  }

  get formattedDob(): string {
    if (!this.profile.dob) return '-';
    const d = new Date(this.profile.dob);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  get age(): number | null {
    if (!this.profile.dob) return null;
    const today = new Date();
    const birth = new Date(this.profile.dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
}
