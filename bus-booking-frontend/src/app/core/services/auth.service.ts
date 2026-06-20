import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  token: string;
}

const USERS_KEY = 'bb_users';
const CURRENT_KEY = 'bb_current';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null')
  );

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUserSubject.value?.token || null;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'ADMIN';
  }

  private getUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  register(data: { name: string; email: string; password: string }): Observable<User> {
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();
    const name = data.name.trim();

    const users = this.getUsers();
    const exists = users.find((u: any) => u.email === email);

    if (exists) {
      return throwError(() => ({
        error: { message: 'Email already registered. Please login.' }
      })).pipe(delay(500));
    }

    const newUser: User = {
      id: Date.now(),
      name,
      email,
      role: 'USER',
      token: 'token-' + Date.now()
    };

    users.push({ ...newUser, password });
    this.saveUsers(users);
    this.setUser(newUser);

    return of(newUser).pipe(delay(800));
  }

  login(data: { email: string; password: string }): Observable<User> {
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    if (email === 'admin@busbook.com' && password === 'admin123') {
      const adminUser: User = {
        id: 0,
        name: 'Admin',
        email: 'admin@busbook.com',
        role: 'ADMIN',
        token: 'admin-token'
      };
      this.setUser(adminUser);
      return of(adminUser).pipe(delay(800));
    }

    const users = this.getUsers();
    const found = users.find((u: any) => u.email === email && u.password === password);

    if (!found) {
      return throwError(() => ({
        error: { message: 'Invalid email or password.' }
      })).pipe(delay(500));
    }

    const user: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role || 'USER',
      token: 'token-' + Date.now()
    };

    this.setUser(user);
    return of(user).pipe(delay(800));
  }

  logout(): void {
    localStorage.removeItem(CURRENT_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private setUser(user: User): void {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
