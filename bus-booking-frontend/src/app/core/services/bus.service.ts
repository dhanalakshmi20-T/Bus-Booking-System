import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Bus, SearchParams } from "../models/bus.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private readonly apiUrl = `${environment.apiUrl}/buses`;

  constructor(private http: HttpClient) {}

  getAllBuses(): Observable<Bus[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(buses => buses.map(bus => this.normalizeBus(bus)))
    );
  }

  getBusById(id: string | number): Observable<Bus> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(bus => this.normalizeBus(bus))
    );
  }

  searchBuses(search: SearchParams): Observable<Bus[]> {
    const params = new HttpParams()
      .set('from', search.from.trim())
      .set('to', search.to.trim())
      .set('date', search.date);

    return this.http.get<any[]>(`${this.apiUrl}/search`, { params }).pipe(
      map(buses => buses.map(bus => this.normalizeBus(bus)))
    );
  }

  addBus(bus: Partial<Bus>): Observable<Bus> {
    return this.http.post<any>(this.apiUrl, bus).pipe(
      map(createdBus => this.normalizeBus(createdBus))
    );
  }

  updateBus(id: string | number, bus: Partial<Bus>): Observable<Bus> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, bus).pipe(
      map(updatedBus => this.normalizeBus(updatedBus))
    );
  }

  deleteBus(id: string | number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }> (
      `${this.apiUrl}/${id}`
    );
  }

  private normalizeBus(bus: any): Bus {
    return {
      ...bus,
      id: bus.id || bus._id
    };
  }
}