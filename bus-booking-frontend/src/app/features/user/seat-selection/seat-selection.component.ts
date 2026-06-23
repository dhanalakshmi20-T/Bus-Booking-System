import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface SeatLayout {
  seatNumber: string;
  status: 'available' | 'booked' | 'selected' | 'ladies';
  type: 'window' | 'aisle';
  deck?: 'lower' | 'upper';
  section?: 'seat' | 'berth';
}

export interface BusSummary {
  id: number;
  busName: string;
  busNumber: string;
  busType: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
}

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.scss']
})
export class SeatSelectionComponent implements OnInit {

  busId = 0;
  date = '';
  from = '';
  to = '';
  isLoading = true;

  bus: BusSummary | null = null;
  seats: SeatLayout[] = [];
  selectedSeats: string[] = [];

  passengerName = '';
  passengerAge = '';
  passengerGender = 'male';
  mobileNumber = '';
  errorMessage = '';
  isBooking = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.busId = Number(this.route.snapshot.paramMap.get('busId'));
    this.route.queryParams.subscribe(params => {
      this.date = params['date'] || '';
      this.from = params['from'] || '';
      this.to   = params['to']   || '';
    });
    this.loadBusAndSeats();
  }

  private loadBusAndSeats(): void {
    setTimeout(() => {
      this.bus = this.getMockBus();
      this.seats = this.generateSeats();
      this.isLoading = false;
    }, 600);
  }

  private getMockBus(): BusSummary {
    const buses: { [key: number]: BusSummary } = {
      1: { id: 1, busName: 'Royal Travels',      busNumber: 'TN01AB1234', busType: 'AC',           from: 'Chennai', to: 'Bangalore', departureTime: '06:00 AM', arrivalTime: '11:00 AM', fare: 350 },
      2: { id: 2, busName: 'Sri Murugan Travels', busNumber: 'TN02CD5678', busType: 'Non-AC',       from: 'Chennai', to: 'Bangalore', departureTime: '08:30 AM', arrivalTime: '02:00 PM', fare: 220 },
      3: { id: 3, busName: 'Orange Travels',      busNumber: 'KA03EF9012', busType: 'Sleeper',      from: 'Chennai', to: 'Bangalore', departureTime: '09:00 PM', arrivalTime: '05:00 AM', fare: 550 },
      4: { id: 4, busName: 'VRL Travels',         busNumber: 'KA04GH3456', busType: 'AC',           from: 'Chennai', to: 'Bangalore', departureTime: '10:30 AM', arrivalTime: '04:30 PM', fare: 420 },
      5: { id: 5, busName: 'SRM Travels',         busNumber: 'TN05IJ7890', busType: 'Semi-Sleeper', from: 'Chennai', to: 'Bangalore', departureTime: '11:00 PM', arrivalTime: '06:00 AM', fare: 480 },
      6: { id: 6, busName: 'Praveen Travels',     busNumber: 'TN06KL2345', busType: 'Non-AC',       from: 'Chennai', to: 'Bangalore', departureTime: '07:00 AM', arrivalTime: '01:00 PM', fare: 190 }
    };
    return buses[this.busId] || buses[1];
  }

  // ── Bus type getters ─────────────────────────────

  get isSleeperBus(): boolean {
    return this.bus?.busType === 'Sleeper';
  }

  get isSemiSleeperBus(): boolean {
    return this.bus?.busType === 'Semi-Sleeper';
  }

  get isStandardBus(): boolean {
    return !this.isSleeperBus && !this.isSemiSleeperBus;
  }

  // ── Seat generation ──────────────────────────────

  private generateSeats(): SeatLayout[] {
    if (this.isSleeperBus)     return this.generateSleeperSeats();
    if (this.isSemiSleeperBus) return this.generateSemiSleeperSeats();
    return this.generateStandardSeats();
  }

  // AC / Non-AC: 2+2, 10 rows = 40 seats
  private generateStandardSeats(): SeatLayout[] {
    const seats: SeatLayout[] = [];
    const booked = [3, 7, 12, 16, 21, 25, 30, 34];
    const ladies = [1, 2, 5, 6];
    for (let i = 1; i <= 40; i++) {
      const col = (i - 1) % 4;
      const type: 'window' | 'aisle' = (col === 0 || col === 3) ? 'window' : 'aisle';
      let status: SeatLayout['status'] = 'available';
      if (booked.includes(i)) status = 'booked';
      else if (ladies.includes(i)) status = 'ladies';
      seats.push({ seatNumber: `S${i}`, status, type, section: 'seat' });
    }
    return seats;
  }

  // Semi-Sleeper: each row has 2 regular seats (left) + 1 sleeper berth (right)
  private generateSemiSleeperSeats(): SeatLayout[] {
    const seats: SeatLayout[] = [];
    const bookedSeats  = [2, 5, 9, 14, 18];
    const bookedBerths = [2, 4, 7];
    const ladiesSeats  = [1, 3];

    let seatNum = 1;
    let berthNum = 1;

    for (let row = 0; row < 10; row++) {
      // Left: 2 regular seats
      for (let col = 0; col < 2; col++) {
        let status: SeatLayout['status'] = 'available';
        if (bookedSeats.includes(seatNum))  status = 'booked';
        else if (ladiesSeats.includes(seatNum)) status = 'ladies';
        seats.push({ seatNumber: `S${seatNum}`, status, type: col === 0 ? 'window' : 'aisle', section: 'seat' });
        seatNum++;
      }
      // Right: 1 sleeper berth
      let status: SeatLayout['status'] = 'available';
      if (bookedBerths.includes(berthNum)) status = 'booked';
      seats.push({ seatNumber: `B${berthNum}`, status, type: 'window', section: 'berth' });
      berthNum++;
    }

    return seats;
  }

  // Sleeper: 2+1, 6 rows lower + 6 rows upper = 18+18 berths
  private generateSleeperSeats(): SeatLayout[] {
    const seats: SeatLayout[] = [];
    const bookedLower = [2, 5, 9, 13];
    const bookedUpper = [3, 7, 11, 15];
    const ladiesBerths = [1, 2];

    for (let i = 1; i <= 18; i++) {
      const col = (i - 1) % 3;
      const type: 'window' | 'aisle' = col === 2 ? 'aisle' : 'window';
      let status: SeatLayout['status'] = 'available';
      if (bookedLower.includes(i)) status = 'booked';
      else if (ladiesBerths.includes(i)) status = 'ladies';
      seats.push({ seatNumber: `L${i}`, status, type, deck: 'lower', section: 'berth' });
    }

    for (let i = 1; i <= 18; i++) {
      const col = (i - 1) % 3;
      const type: 'window' | 'aisle' = col === 2 ? 'aisle' : 'window';
      let status: SeatLayout['status'] = 'available';
      if (bookedUpper.includes(i)) status = 'booked';
      seats.push({ seatNumber: `U${i}`, status, type, deck: 'upper', section: 'berth' });
    }

    return seats;
  }

  // ── Row getters ──────────────────────────────────

  // Standard seats OR semi-sleeper lower seats (2+2)
  get rows(): SeatLayout[][] {
    let src: SeatLayout[];
    if (this.isSleeperBus) {
      src = this.seats.filter(s => s.deck === 'lower');
    } else if (this.isSemiSleeperBus) {
      src = this.seats.filter(s => s.section === 'seat');
    } else {
      src = this.seats;
    }
    const rows: SeatLayout[][] = [];
    for (let i = 0; i < src.length; i += 4) {
      rows.push(src.slice(i, i + 4));
    }
    return rows;
  }

  // Sleeper upper berths (2+1)
  get upperRows(): SeatLayout[][] {
    const src = this.seats.filter(s => s.deck === 'upper' && this.isSleeperBus);
    const rows: SeatLayout[][] = [];
    for (let i = 0; i < src.length; i += 3) {
      rows.push(src.slice(i, i + 3));
    }
    return rows;
  }

  // Semi-sleeper: combined rows [seat, seat, berth] per row
  get semiRows(): SeatLayout[][] {
    const rows: SeatLayout[][] = [];
    for (let i = 0; i < this.seats.length; i += 3) {
      rows.push(this.seats.slice(i, i + 3));
    }
    return rows;
  }

  // Sleeper: each row pairs lower berths + upper berths side by side
  get sleeperRows(): { lower: SeatLayout[], upper: SeatLayout[] }[] {
    const lower = this.seats.filter(s => s.deck === 'lower');
    const upper = this.seats.filter(s => s.deck === 'upper');
    const rows = [];
    const totalRows = Math.ceil(lower.length / 3);
    for (let i = 0; i < totalRows; i++) {
      rows.push({
        lower: lower.slice(i * 3, i * 3 + 3),
        upper: upper.slice(i * 3, i * 3 + 3)
      });
    }
    return rows;
  }

  get totalFare(): number {
    return this.selectedSeats.length * (this.bus?.fare || 0);
  }

  // ── Actions ──────────────────────────────────────

  toggleSeat(seat: SeatLayout): void {
    if (seat.status === 'booked') return;
    if (seat.status === 'selected') {
      const ladiesSeats = ['S1','S2','S5','S6','S1','S4','S5','L1','L2'];
      seat.status = ladiesSeats.includes(seat.seatNumber) ? 'ladies' : 'available';
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat.seatNumber);
    } else {
      if (this.selectedSeats.length >= 6) {
        this.errorMessage = 'You can select a maximum of 6 seats.';
        return;
      }
      seat.status = 'selected';
      this.selectedSeats.push(seat.seatNumber);
      this.errorMessage = '';
    }
  }

  confirmBooking(): void {
    this.errorMessage = '';
    if (this.selectedSeats.length === 0) { this.errorMessage = 'Please select at least one seat.'; return; }
    if (!this.passengerName.trim()) { this.errorMessage = 'Please enter passenger name.'; return; }
    if (!this.passengerAge || Number(this.passengerAge) < 1 || Number(this.passengerAge) > 99) {
      this.errorMessage = 'Please enter a valid age (1–99).'; return;
    }
    if (!this.mobileNumber.trim() || this.mobileNumber.length !== 10) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number.'; return;
    }

    this.isBooking = true;
    const booking = {
      busId: this.busId, busName: this.bus?.busName, busNumber: this.bus?.busNumber,
      from: this.bus?.from, to: this.bus?.to, date: this.date,
      departureTime: this.bus?.departureTime, arrivalTime: this.bus?.arrivalTime,
      seats: this.selectedSeats, totalFare: this.totalFare,
      passengerName: this.passengerName.trim(), passengerAge: this.passengerAge,
      passengerGender: this.passengerGender, mobileNumber: this.mobileNumber.trim(),
      status: 'CONFIRMED', bookingId: 'BK' + Date.now(), bookedAt: new Date().toISOString()
    };

    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('bb_bookings') || '[]');
      existing.push(booking);
      localStorage.setItem('bb_bookings', JSON.stringify(existing));
      this.isBooking = false;
      this.router.navigate(['/booking-success'], { queryParams: { bookingId: booking.bookingId } });
    }, 1200);
  }

  goBack(): void {
    this.router.navigate(['/search-buses'], {
      queryParams: { from: this.from, to: this.to, date: this.date }
    });
  }
}
  