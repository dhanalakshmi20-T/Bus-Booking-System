import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService } from 'src/app/core/services/bus.service';

@Component({
  selector: 'app-search-buses',
  templateUrl: './search-buses.component.html',
  styleUrls: ['./search-buses.component.scss']
})
export class SearchBusesComponent implements OnInit {

  buses: any[] = [];
  loading = false;
  from = '';
  to = '';
  date = '';

  constructor(private route: ActivatedRoute, private busService: BusService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.from = params['from'] || '';
      this.to = params['to'] || '';
      this.date = params['date'] || '';
      if (this.from || this.to) this.search();
    });
  }

  search(): void {
    this.loading = true;
    this.busService.searchBuses(this.from, this.to, this.date).subscribe({
      next: (data) => { this.buses = data; this.loading = false },
      error: () => this.loading = false
    });
  }

  availableSeats(bus: any): number {
    return (bus.seats || []).filter((s: any) => !s.isBooked).length;
  }

  selectBus(bus: any): void {
    this.router.navigate(['/seat-selection', bus._id]);
  }

}
