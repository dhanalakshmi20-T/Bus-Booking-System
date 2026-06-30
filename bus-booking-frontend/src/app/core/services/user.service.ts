import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserSummary } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserSummary[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => users.map(user => this.normalize(user)))
    );
  }

  updateStatus(id: string, status: UserSummary['status']): Observable<UserSummary> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map(user => this.normalize(user))
    );
  }

  updateRole(id: string, role: UserSummary['role']): Observable<UserSummary> {
    return this.http.put<any>(`${this.apiUrl}/${id}/role`, {
      role: role.toLowerCase()
    }).pipe(map(user => this.normalize(user)));
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  private normalize(user: any): UserSummary {
    return {
      ...user,
      id: user.id || user._id,
      role: String(user.role).toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
      status: user.status === 'BLOCKED' ? 'BLOCKED' : 'ACTIVE'
    };
  }
}
