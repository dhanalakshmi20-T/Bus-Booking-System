import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  from = '';
  to = '';
  date = '';

  features = [
    {
      icon: 'bi-shield-check',
      title: 'Safe & Secure',
      desc: 'All bookings are encrypted and your data is fully protected.'
    },

    {
      icon: 'bi-lightning-charge-fill',
      title: 'Instant Booking',
      desc: 'Book your seat in under 2 minutes - fast and hassle-free.'
    },

    {
      icon: 'bi-geo-alt-fill',
      title: 'Live Tracking',
      desc: 'Track your bus in real-time from pickup to destination.'
    },

    {
      icon: 'bi-headset',
      title: '24/7 Support',
      desc: 'Our support team is always available to help you anytime.'
    },

    {
      icon: 'bi-tag-fill',
      title: 'Best Prices',
      desc: 'Get the lowest fares with exclusive deals and discounts.'
    },

    {
      icon: 'bi-arrow-repeat',
      title: 'Easy Cancellation',
      desc: 'Cancel or reschedule your booking with zero hassle.'
    }
  ];

  popularRoutes = [
    { from: 'Chennai', to: 'Bangalore', duration: '5 hrs', fare: '₹350' },
    { from: 'Mumbai', to: 'Pune', duration: '3 hrs', fare: '₹250' },
    { from: 'Delhi', to: 'Agra', duration: '4 hrs', fare: '₹300' },
    { from: 'Hyderabad', to: 'Chennai', duration: '6 hrs', fare: '₹450' },
    { from: 'Kolkata', to: 'Bhuvaneswar', duration: '5 hrs', fare: '₹380' },
    { from: 'Coimbatore', to: 'Chennai', duration: '7 hrs', fare: '₹420' }
  ];

  stats = [
    { value: '10,000+', label: 'Happy Travellers' },
    { value: '500+', label: 'Bus Routes' },
    { value: '50+', label: 'Cities Covered' },
    { value: '99%', label: 'On-Time Arrival' }
  ];

  constructor(private router: Router) {}

  onSearch(): void {
    if (!this.from.trim() || !this.to.trim() || !this.date) {
      return;
    }

    this.router.navigate(['/search-buses'], {
      queryParams: {
        from: this.from.trim(),
        to: this.to.trim(),
        date: this.date
      }
    });
  }

}
