import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

export interface Passenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
}

export interface BusDetails {
  busName: string;
  from: string;
  to: string;
  date: string;
  departureTime?: string;
  arrivalTime?: string;
  fare?: number;
}

export interface UserDetails {
  name: string;
  email: string;
}

export interface Booking {
  id: string;
  userId: string;
  busId: string;
  passengers: Passenger[];
  totalFare: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  bookingDate: string;
  busDetails?: BusDetails;
  userDetails?: UserDetails;
}

export interface BookingRequest {
  busId: string | number;
  passengers: Passenger[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(request: BookingRequest): Observable<Booking> {
    return this.http.post<any>(this.apiUrl, request).pipe(
      map(booking => this.normalizeBooking(booking))
    );
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my`).pipe(
      map(bookings => bookings.map(booking => this.normalizeBooking(booking)))
    );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      map(bookings => bookings.map(booking => this.normalizeBooking(booking)))
    );
  }

  cancelBooking(id: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/cancel/${id}`,
      {}
    );
  }
  
  private normalizeBooking(booking: any): Booking {
    return {
      ...booking,
      id: booking.id || booking._id,
      userId: booking.userId || booking.user,
      busId: booking.busId || booking.bus,
      status: (booking.status || 'pending').toUpperCase()
    };
  }
}