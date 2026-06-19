import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Seat {
  seatNumber: string;
  isBooked: boolean;
}

export interface Booking {
  id: number;
  userId: number;
  busId: number;
  busName: string;
  from: string;
  to: string;
  departureTime: string;
  journeyDate: string;
  seatNumbers: string[];
  totalFare: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  bookingDate: string;
}

export interface BookingRequest {
  busId: number;
  journeyDate: string;
  seatNumbers: string[];
  totalFare: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(booking: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/my-bookings`);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  cancelBooking(id: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/all`);
  }

  getAvailableSeats(busId: number, date: string): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.apiUrl}/seats/${busId}?date=${date}`);
  }
}
