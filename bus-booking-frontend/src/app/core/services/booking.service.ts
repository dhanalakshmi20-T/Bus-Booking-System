import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Booking, BookingRequest, CancelBookingResponse } from "../models/booking.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

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

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
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

  cancelBooking(id: string): Observable<CancelBookingResponse> {
    return this.http.put<CancelBookingResponse>(
      `${this.apiUrl}/cancel/${id}`, {}
    );
  }

  private normalizeBooking(booking: any): Booking {
    return {
      ...booking,
      id: booking.id || booking._id,
      userId: booking.userId || booking.user,
      busId: booking.busId || booking.bus,
      status: this.normalizeStatus(booking.status)
    };
  }

  private normalizeStatus(status: string): Booking['status'] {
    const normalized = String(status || '').toUpperCase();

    if (normalized === 'CONFIRMED' || normalized === 'CANCELLED') {
      return normalized;
    }

    return 'PENDING';
  }
}