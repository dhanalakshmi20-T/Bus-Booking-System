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

  constructor(private route: ActivatedRoute, private busService: BusService, private bookingService: BookingService, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('busId')!;
    this.busService.getBusById(id).subscribe(data => this.bus = data);
  }

  toggleSeat(seat: any): void {
    if (seat.isBooked) return;
    const idx = this.selectedSeats.indexOf(seat.seatNumber);
    if (idx > -1) this.selectedSeats.splice(idx, 1);
    else this.selectedSeats.push(seat.seatNumber);
  }

  isSelected(seatNumber: string): boolean {
    return this.selectedSeats.includes(seatNumber);
  }

  get totalFare(): number {
    return this.bus ? this.bus.fare * this.selectedSeats.length : 0;
  }

  confirmBooking(): void {
    if (!this.selectedSeats.length) {
      this.message = 'Please select at least one seat.';
      return;
    }
    const passengers = this.selectedSeats.map(s => ({ seatNumber: s, name: this.passengerName || 'Passenger' }));
    this.bookingService.createBooking({ busId: this.bus._id, passengers }).subscribe({
      next: () => {
        this.message = 'Booking confirmed!'; setTimeout(() => this.router.navigate(['/my-bookings']), 1500);
      },
      error: (err) => this.message = err.error?.message || 'Booking failed'
    });
  }

}
