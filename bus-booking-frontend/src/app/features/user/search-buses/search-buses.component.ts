import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bus, BusService } from 'src/app/core/services/bus.service';

@Component({
  selector: 'app-search-buses',
  templateUrl: './search-buses.component.html',
  styleUrls: ['./search-buses.component.scss']
})
export class SearchBusesComponent implements OnInit {

  from = '';
  to = '';
  date = '';

  buses: Bus[] = [];
  filteredBuses: Bus[] = [];
  isLoading = false;
  searched = false;
  errorMessage = '';

  sortBy = 'fare';
  filterType = 'ALL';
  
  busTypes = ['ALL', 'AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'];

  constructor(private route: ActivatedRoute, private router: Router, private busService: BusService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.from = params['from'] || '';
      this.to = params['to'] || '';
      this.date = params['date'] || '';
      if (this.from && this.to) {
        this.searchBuses();
      }
    });
  }
                                                                                                                                                                  
  searchBuses(): void {
    if (!this.from || !this.to || !this.date) {
      this.errorMessage = 'Please fill in all search fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.searched = true;

    setTimeout(() => {
      this.buses = this.getMockBuses();
      this.applyFilter();
      this.isLoading = false;
    }, 800);
  }

  applyFilter(): void {
    let result = [...this.buses];

    if (this.filterType !== 'ALL') {
      result = result.filter(b => b.busType === this.filterType);
    }

    if (this.sortBy === 'fare') {
      result.sort((a, b) => a.fare - b.fare);
    }
    else if (this.sortBy === 'duration') {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }
    else if (this.sortBy === 'seats') {
      result.sort((a, b) => b.availableSeats - a.availableSeats);
    }

    this.filteredBuses = result;
  }

  selectBus(bus: Bus): void {
    this.router.navigate(['/seat-selection', bus.id], {
      queryParams: { date: this.date, from: this.from, to: this.to }
    });
  }

  swapCities(): void {
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
  }

  private getMockBuses(): Bus[] {
    return [
      {
        id: 1, busName: 'Royal Travels', busNumber: 'TN01AB1234',
        busType: 'AC', from: this.from, to: this.to,
        departureTime: '6:00 AM', arrivalTime: '11:00 AM',
        totalSeats: 40, availableSeats: 18, fare: 350, status: 'ACTIVE'
      },

      {
        id: 2, busName: 'Sri Murugan Travels', busNumber: 'TN02CD25678',
        busType: 'Non-AC', from: this.from, to: this.to,
        departureTime: '08:30 AM', arrivalTime: '02:00 PM',
        totalSeats: 45, availableSeats: 30, fare: 220, status: 'ACTIVE'
      },

      {
        id: 3, busName: 'Orange Travels', busNumber: 'KA03EF9012',
        busType: 'Sleeper', from: this.from, to: this.to,
        departureTime: '09:00 PM', arrivalTime: '05:00 AM',
        totalSeats: 36, availableSeats: 10, fare: 550, status: 'ACTIVE'
      },

      {
        id: 4, busName: 'VRL Travels', busNumber: 'KA04GH3456',
        busType: 'AC', from: this.from, to: this.to,
        departureTime: '10:30 AM', arrivalTime: '04:30 PM',
        totalSeats: 40, availableSeats: 25, fare: 420, status: 'ACTIVE'
      },

      {
        id: 5, busName: 'SRM Travels', busNumber: 'TN05IJ7890',
        busType: 'Semi-Sleeper', from: this.from, to: this.to,
        departureTime: '11:00 PM', arrivalTime: '06:00 AM',
        totalSeats: 40, availableSeats: 5, fare: 480, status: 'ACTIVE'
      },

      {
        id: 6, busName: 'Praveen Travels', busNumber: 'TN06KL2345',
        busType: 'Non-AC', from: this.from, to: this.to,
        departureTime: '07:00 AM', arrivalTime: '01:00 PM',
        totalSeats: 50, availableSeats: 40, fare: 190, status: 'ACTIVE'
      }
    ];
  }
}
