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
  status?: 'ACTIVE' | 'BLOCKED';
  mobile?: string;
  dob?: string;
  gender?: string;
  address?: string;
}

export interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'bb_users';
const CURRENT_KEY = 'bb_current';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredSession());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

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

  register(data: { name: string; email: string; password: string; }): Observable<User> {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();
    const users = this.getUsers();

    const alreadyExists = users.some(user => user.email.toLowerCase() === email);

    if (alreadyExists) {
      return throwError({
        error: {
          message: 'Email is already registered. Please login.'
        }
      });
    }

    const user: User = {
      id: Date.now(),
      name,
      email,
      role: 'USER',
      status: 'ACTIVE',
      token: this.createToken()
    };

    users.push({ ...user, password });
    this.saveUsers(users);
    this.setSession(user);

    return of(user).pipe(delay(800));
  }

  login(data: { email: string; password: string; }): Observable<User> {
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    if (email === 'admin@busbook.com' && password === 'admin123') {
      const admin: User = {
        id: 0,
        name: 'Admin',
        email,
        role: 'ADMIN',
        status: 'ACTIVE',
        token: this.createToken()
      };

      this.setSession(admin);
      return of(admin).pipe(delay(800));
    }

    const storedUser = this.getUsers().find(user =>
      user.email.toLowerCase() === email && user.password === password
    );

    if (!storedUser) {
      return throwError({
        error: { message: 'Invalid email or password.' }
      });
    }

    if (storedUser.status === 'BLOCKED') {
      return throwError({
        error: { message: 'Your account has been blocked. Contact support.' }
      });
    }

    const { password: ignoredPassword, ...userData } = storedUser;

    const user: User = {
      ...userData,
      role: userData.role || 'USER',
      status: userData.status || 'ACTIVE',
      token: this.createToken()
    };

    this.setSession(user);
    return of(user).pipe(delay(800));
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

  private getUsers(): StoredUser[] {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    }
    catch {
      return [];
    }
  }

  private saveUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private getStoredSession(): User | null {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null');
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

  private createToken(): string {
    return `token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
