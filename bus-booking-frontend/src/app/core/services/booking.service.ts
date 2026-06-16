import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) { }

  createBooking(data: { busId: string; passengers: any[] }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my`);
  }

  cancelBooking(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/cancel/${id}`, {});
  }

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
