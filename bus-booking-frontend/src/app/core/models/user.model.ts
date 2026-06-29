export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    token: string;
    status: UserStatus;
    phone?: string;
    mobile?: string;
    dob?: string;
    gender?: string;
    address?: string
}

export interface BackendUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'user' | 'admin';
    status: UserStatus;
}

export interface AuthResponse {
    token: string;
    user: BackendUser;
}