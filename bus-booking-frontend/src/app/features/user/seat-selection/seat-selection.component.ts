import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/core/services/booking.service';
import { BusService } from 'src/app/core/services/bus.service';

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.scss']
})
export class SeatSelectionComponent implements OnInit {

  bus: any = null;
  selectedSeats: string[] = [];
  passengerName = '';
  message = '';
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private busService: BusService,
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('busId')!;
    this.busService.getBusById(id).subscribe(data => this.bus = data);
  }

  get rows(): (any | null)[][] {
    if (!this.bus) return [];
    const seats = this.bus.seats;
    const rows: (any | null)[][] = [];
    for (let i = 0; i < seats.length; i += 4) {
      const row: (any | null)[] = seats.slice(i, i + 4);
      while (row.length < 4) row.push(null);
      rows.push(row);
    }
    return rows;
  }

  get availableCount(): number {
    return this.bus ? this.bus.seats.filter((s: any) => !s.isBooked).length : 0;
  }

  get totalFare(): number {
    return this.bus ? this.bus.fare * this.selectedSeats.length : 0;
  }

  toggleSeat(seat: any): void {
    if (seat.isBooked) return;
    const idx = this.selectedSeats.indexOf(seat.seatNumber);
    if (idx > -1) this.selectedSeats.splice(idx, 1);
    else this.selectedSeats.push(seat.seatNumber);
    this.message = '';
  }

  isSelected(seatNumber: string): boolean {
    return this.selectedSeats.includes(seatNumber);
  }

  confirmBooking(): void {
    if (!this.selectedSeats.length) {
      this.message = 'Please select at least one seat.';
      this.isError = true;
      return;
    }
    const passengers = this.selectedSeats.map(s => ({
      seatNumber: s,
      name: this.passengerName || 'Passenger'
    }));
    this.bookingService.createBooking({ busId: this.bus._id, passengers }).subscribe({
      next: () => {
        this.message = 'Booking confirmed!';
        this.isError = false;
        setTimeout(() => this.router.navigate(['/my-bookings']), 1500);
      },
      error: (err) => {
        this.message = err.error?.message || 'Booking failed.';
        this.isError = true;
      }
    });
  }

}
