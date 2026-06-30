import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Bus } from "src/app/core/models/bus.model";
import { SeatLayout } from "src/app/core/models/seat.model";
import { BookingService } from "src/app/core/services/booking.service";
import { BusService } from "src/app/core/services/bus.service";

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.scss']
})
export class SeatSelectionComponent implements OnInit {

  busId = '';
  date = '';
  from = '';
  to = '';

  bus: Bus | null = null;
  seats: SeatLayout[] = [];
  selectedSeats: string[] = [];

  passengerName = '';
  passengerAge = '';
  passengerGender = 'female';
  mobileNumber = '';

  isLoading = true;
  isBooking = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busService: BusService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.busId = this.route.snapshot.paramMap.get('busId') || '';

    this.route.queryParams.subscribe(params => {
      this.date = params.date || '';
      this.from = params.from || '';
      this.to = params.to || '';
    });

    if (!this.busId) {
      this.errorMessage = 'Invalid bus selection';
      this.isLoading = false;
      return;
    }

    this.loadBusAndSeats();
  }

  private loadBusAndSeats(): void {
    this.isLoading = true;

    this.busService.getBusById(this.busId).subscribe({
      next: bus => {
        this.bus = bus,
        this.date = this.date || bus.date || '';
        this.from = bus.from;
        this.to = bus.to;
        this.seats = this.buildSeats(bus);
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to load details.';
        this.isLoading = false;
      }
    });
  }

  private buildSeats(bus: Bus): SeatLayout[] {
    const source = bus.seats || [];
    const half = Math.ceil(source.length / 2);

    return source.map((seat, index) => {
      const layout: SeatLayout = {
        seatNumber: seat.seatNumber,
        status: seat.isBooked ? 'booked' : 'available',
        type: 'aisle',
        section: 'seat'
      };

      if (bus.busType === 'Sleeper') {
        const deckIndex = index < half ? index : index - half;

        layout.deck = index < half ? 'lower' : 'upper';
        layout.section = 'berth';
        layout.type = deckIndex % 3 === 2 ? 'aisle' : 'window';
      }
      else if (bus.busType === 'Semi-Sleeper') {
        const column = index % 3;

        layout.section = column === 2 ? 'berth' : 'seat';

        layout.type = column === 0 || column === 2 ? 'window' : 'aisle';
      }
      else {
        const column = index % 4;

        layout.type = column === 0 || column === 3 ? 'window' : 'aisle';
      }

      return layout;
    });
  }

  get isSleeperBus(): boolean {
    return this.bus?.busType === 'Sleeper';
  }

  get isSemiSleeperBus(): boolean {
    return this.bus?.busType === 'Semi-Sleeper';
  }

  get isStandardBus(): boolean {
    return !this.isSleeperBus && !this.isSemiSleeperBus;
  }

  get rows(): SeatLayout[][] {
    const rows: SeatLayout[][] = [];

    for (let index = 0; index < this.seats.concat.length; index += 4) {
      rows.push(this.seats.slice(index, index + 4));
    }

    return rows;
  }

  get semiRows(): SeatLayout[][] {
    const rows: SeatLayout[][] = [];

    for (let index = 0; index < this.seats.length; index += 3) {
      rows.push(this.seats.slice(index, index + 3));
    }

    return rows;
  }

  get sleeperRows(): {
    lower: SeatLayout[];
    upper: SeatLayout[];
  }[] {
    const lower = this.seats.filter(seat => seat.deck === 'lower');

    const upper = this.seats.filter(seat => seat.deck === 'upper');

    const totalRows = Math.max(Math.ceil(lower.length / 3), Math.ceil(upper.length / 3));

    const rows: {
      lower: SeatLayout[];
      upper: SeatLayout[];
    }[] = [];

    for (let index = 0; index < totalRows; index++) {
      rows.push({
        lower: lower.slice(index * 3, index * 3 + 3),
        upper: upper.slice(index * 3, index * 3 + 3)
      });
    }

    return rows;
  }

  get totalFare(): number {
    return this.selectedSeats.length * (this.bus?.fare || 0);
  }

  toggleSeat(seat: SeatLayout): void {
    if (seat.status === 'booked') {
      return;
    }

    if (seat.status === 'selected') {
      seat.status = 'available';
      this.selectedSeats = this.selectedSeats.filter(seatNumber => seatNumber !== seat.seatNumber);
      return;
    }

    if (this.selectedSeats.length >= 6) {
      this.errorMessage = 'You can select a maximum of 6 seats.';
      return;
    }

    seat.status = 'selected';
    this.selectedSeats.push(seat.seatNumber);
    this.errorMessage = '';
  }

  confirmBooking(): void {
    this.errorMessage = '';

    if (!this.bus) {
      this.errorMessage = 'Bus details are unavailable.';
      return;
    }

    if (this.selectedSeats.length === 0) {
      this.errorMessage = 'Please select at least one seat.';
      return;
    }

    if (!this.passengerName.trim()) {
      this.errorMessage = 'Please enter passenger name.';
      return;
    }

    const age = Number(this.passengerAge);

    if (!age || age < 1 || age > 99) {
      this.errorMessage = 'Please enter a valid age between 1 and 99.';
      return;
    }

    if (!/^\d{10}$/.test(this.mobileNumber.trim())) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number';
      return;
    }

    this.isBooking = true;

    this.bookingService.createBooking({
      busId: this.busId,
      passengers: this.selectedSeats.map(seatNumber => ({
        name: this.passengerName.trim(),
        age,
        gender: this.passengerGender,
        seatNumber,
        mobileNumber: this.mobileNumber.trim()
      }))
    }).subscribe({
      next: booking => {
        this.isBooking = false;

        this.router.navigate(['/booking-success'], {
          queryParams: {
            bookingId: booking.bookingId || booking.id
          }
        });
      },
      error: error => {
        this.isBooking = false;
        this.errorMessage = error.error?.message || 'Unable to complete booking.';

        if (error.status === 409) {
          this.selectedSeats = [];
          this.loadBusAndSeats();
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/search-buses'], {
      queryParams: {
        from: this.from,
        to: this.to,
        date: this.date
      }
    });
  }
}
