import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private apiUrl = `${environment.apiUrl}/buses`;

  constructor(private http: HttpClient) { }

  getAllBuses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  searchBuses(from: string, to: string, date: string): Observable<any[]> {
    const params = new HttpParams().set('from', from).set('to', to).set('date', date);
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params });
  }

  getBusById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createBus(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateBus(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteBus(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
