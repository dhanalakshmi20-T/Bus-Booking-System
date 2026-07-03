import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthResponse, BackendUser, User, UserProfile } from '../models/user.model';

const CURRENT_KEY = 'bb_current';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredSession());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUser?.token || this.getStoredToken();
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  private getStoredToken(): string | null {
    try {
      const user = JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null');
      return user?.token || null;
    } catch {
      return null;
    }
  }

  register(data: { name: string; email: string; password: string; phone?: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      map(response => this.createSession(response))
    );
  }

  login(data: { email: string; password: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      map(response => this.createSession(response))
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<BackendUser>(`${this.apiUrl}/profile`).pipe(map(response => {
      const user = this.toUser(response, this.token || '');
      this.setSession(user);
      return user;
    }));
  }

  updateProfile(profile: UserProfile): Observable<User> {
    return this.http.put<BackendUser>(`${this.apiUrl}/profile`, {
      name: profile.name,
      phone: profile.mobile,
      dob: profile.dob,
      gender: profile.gender,
      address: profile.address
    }).pipe(map(response => {
      const user = this.toUser(response, this.token || '');
      this.setSession(user);
      return user;
    }));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/password`, {
      currentPassword,
      newPassword
    });
  }

  logout(): void {
    localStorage.removeItem(CURRENT_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  updateCurrentUser(changes: Partial<User>): void {
    if (this.currentUser) this.setSession({ ...this.currentUser, ...changes });
  }

  private createSession(response: AuthResponse): User {
    const user = this.toUser(response.user, response.token);
    this.setSession(user);
    return user;
  }

  private toUser(user: BackendUser, token: string): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      mobile: user.phone,
      role: user.role === 'admin' ? 'ADMIN' : 'USER',
      status: user.status || 'ACTIVE',
      dob: user.dob,
      gender: user.gender,
      address: user.address,
      token
    };
  }

  private getStoredSession(): User | null {
    try {
      const user = JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null');
      return user?.token ? user : null;
    } catch {
      localStorage.removeItem(CURRENT_KEY);
      return null;
    }
  }

  private setSession(user: User): void {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
