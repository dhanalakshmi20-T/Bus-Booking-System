import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthResponse, User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

const CURRENT_KEY = 'bb_current';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredSession());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUser?.token || null;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  register(data: { name: string; email: string; password: string; phone?: string; }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(map(response => this.createSession(response)));
  }

  login(data: { email: string; password: string; }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(map(response => this.createSession(response)));
  }

  logout(): void {
    localStorage.removeItem(CURRENT_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  updateCurrentUser(changes: Partial<User>): void {
    if (!this.currentUser) {
      return;
    }

    this.setSession({
      ...this.currentUser,
      ...changes
    });
  }

  private createSession(response: AuthResponse): User {
    const user: User = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      phone: response.user.phone,
      mobile: response.user.phone,
      role: response.user.role === 'admin' ? 'ADMIN' : 'USER',
      status: response.user.status || 'ACTIVE',
      token: response.token
    };

    this.setSession(user);
    return user;
  }

  private getStoredSession(): User | null {
    try {
      const user = JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null');

      return user?.token ? user : null;
    }
    catch {
      localStorage.removeItem(CURRENT_KEY);
      return null;
    }
  }

  private setSession(user: User): void {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}