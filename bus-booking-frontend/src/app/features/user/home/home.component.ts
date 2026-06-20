import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  user: User | null = null;
  currentDate = new Date();

  quickLinks = [
    {
      icon: 'bi-search',
      label: 'Search Buses',
      route: '/search-buses',
      color: '#7c4dff'
    },

    {
      icon: 'bi-ticket-perforated-fill',
      label: 'My Bookings',
      route: '/my-bookings',
      color: '#00897b'
    },

    {
      icon: 'bi-geo-alt-fill',
      label: 'Track Bus',
      route: '/my-bookings',
      color: '#e65100'
    },

    {
      icon: 'bi-person-fill',
      label: 'My Profile',
      route: '/profile',
      color: '#1565c0'
    }
  ];

  popularRoutes = [
    { from: 'Chennai', to: 'Bangalore', duration: '5 hrs', fare: '₹350' },
    { from: 'Mumbai', to: 'Pune', duration: '3 hrs', fare: '₹250' },
    { from: 'Delhi', to: 'Agra', duration: '4 hrs', fare: '₹300' },
    { from: 'Hyderabad', to: 'Chennai', duration: '6 hrs', fare: '₹450' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  searchBuses(from: string, to: string): void {
    this.router.navigate(['/search-buses'], {
      queryParams: { from, to }
    });
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }
}
