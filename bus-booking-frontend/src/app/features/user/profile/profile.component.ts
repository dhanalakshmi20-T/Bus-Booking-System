import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserProfile } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';

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
  saving = false;
  saveSuccess = false;
  errorMessage = '';
  totalBookings = 0;
  confirmedBookings = 0;
  cancelledBookings = 0;
  totalSpent = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadStats();
  }

  private loadProfile(): void {
    const user = this.authService.currentUser;
    if (!user) return;
    this.profile = {
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || user.phone || '',
      dob: user.dob || '',
      gender: user.gender || 'male',
      address: user.address || ''
    };
  }

  private loadStats(): void {
    this.bookingService.getMyBookings().subscribe({
      next: bookings => {
        this.totalBookings = bookings.length;
        this.confirmedBookings = bookings.filter(item => item.status === 'CONFIRMED').length;
        this.cancelledBookings = bookings.filter(item => item.status === 'CANCELLED').length;
        this.totalSpent = bookings
          .filter(item => item.status === 'CONFIRMED')
          .reduce((sum, item) => sum + item.totalFare, 0);
      },
      error: () => {
        this.errorMessage = 'Unable to load booking statistics.';
      }
    });
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
    if (this.profile.mobile && !/^\d{10}$/.test(this.profile.mobile)) {
      this.errorMessage = 'Enter a valid 10-digit mobile number.';
      return;
    }

    this.saving = true;
    this.authService.updateProfile(this.profile).subscribe({
      next: () => {
        this.saving = false;
        this.editMode = false;
        this.saveSuccess = true;
        this.loadProfile();
        setTimeout(() => this.saveSuccess = false, 3000);
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error.error?.message || 'Unable to save profile.';
      }
    });
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
    const words = this.profile.name.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    return this.profile.name.slice(0, 2).toUpperCase() || 'U';
  }

  get formattedDob(): string {
    if (!this.profile.dob) return '-';
    return new Date(this.profile.dob).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  get age(): number | null {
    if (!this.profile.dob) return null;
    const today = new Date();
    const birth = new Date(this.profile.dob);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
}
