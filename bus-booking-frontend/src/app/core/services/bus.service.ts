import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Bus {
  id: number;
  busName: string;
  busNumber: string;
  busType: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  fare: number;
  status: string;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private apiUrl = 'http://localhost:8080/api/buses';

  constructor(private http: HttpClient) {}

  getAllBuses(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.apiUrl);
  }

  getBusById(id: number): Observable<Bus> {
    return this.http.get<Bus>(`${this.apiUrl}/${id}`);
  }

  searchBuses(params: SearchParams): Observable<Bus[]> {
    const httpParams = new HttpParams()
      .set('from', params.from)
      .set('to', params.to)
      .set('date', params.date);
    return this.http.get<Bus[]>(`${this.apiUrl}/search`, { params: httpParams });
  }

  addBus(bus: Partial<Bus>): Observable<Bus> {
    return this.http.post<Bus>(this.apiUrl, bus);
  }

  updateBus(id: number, bus: Partial<Bus>): Observable<Bus> {
    return this.http.post<Bus>(`${this.apiUrl}/${id}`, bus);
  }

  deleteBus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
