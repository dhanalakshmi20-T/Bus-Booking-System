import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Bus } from "src/app/core/models/bus.model";
import { BusService } from "src/app/core/services/bus.service";

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

  busTypes = [
    'ALL',
    'AC',
    'Non-AC',
    'Sleeper',
    'Semi-Sleeper'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busService: BusService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.from = params.from || '';
      this.to = params.to || '';
      this.date = params.data || '';

      if (this.from && this.to && this.date) {
        this.searchBuses();
      }
    });
  }

  searchBuses(): void {
    this.from = this.from.trim();
    this.to = this.to.trim();

    if (!this.from || !this.to || !this.date) {
      this.errorMessage = 'Please fill in all search fields';
      return;
    }

    this.isLoading = true;
    this.searched = true;
    this.errorMessage = '';

    this.busService.searchBuses({
      from: this.from,
      to: this.to,
      date: this.date
    }).subscribe({
      next: buses => {
        this.buses = buses;
        this.applyFilter();
        this.isLoading = false;
      },
      error: error => {
        this.buses = [];
        this.filteredBuses = [];
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Unable to search buses. Please try again.';
      }
    });
  }

  applyFilter(): void {
    let result = [...this.buses];

    if (this.filterType !== 'ALL') {
      result = result.filter(bus => bus.busType === this.filterType);
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
    this.router.navigate(['/seat-selection', bus.id],
      {
        queryParams: {
          date: this.date,
          from: this.from,
          to: this.to
        }
      }
    );
  }

  swapCities(): void {
    const previousFrom = this.from;
    this.from = this.to;
    this.to = previousFrom;

    if (this.searched && this.date) {
      this.searchBuses();
    }
  }
}