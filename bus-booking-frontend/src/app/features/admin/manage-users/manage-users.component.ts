import { Component, OnInit } from '@angular/core';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  token?: string;
  password?: string;
  mobile?: string;
  gender?: string;
  dob?: string;
  address?: string;
  status?: 'ACTIVE' | 'BLOCKED';
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  
  users: AdminUser[] = [];
  searchText = '';
  roleFilter = 'ALL';

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.users = JSON.parse(localStorage.getItem('bb_users') || '[]')
      .map((user: AdminUser) => ({
        ...user,
        role: user.role || 'USER',
        status: user.status || 'ACTIVE'
      }));
  }

  private saveUsers(): void {
    localStorage.setItem('bb_users', JSON.stringify(this.users));
  }

  get filteredUsers(): AdminUser[] {
    const term = this.searchText.trim().toLowerCase();

    return this.users.filter(user => {
      const matchesRole = this.roleFilter === 'ALL' || user.role === this.roleFilter;
      const matchesSearch = !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.mobile || '').includes(term);

      return matchesRole && matchesSearch;
    });
  }

  get activeCount(): number {
    return this.users.filter(user => user.status === 'ACTIVE').length;
  }

  get blockedCount(): number {
    return this.users.filter(user => user.status === 'BLOCKED').length;
  }

  get adminCount(): number {
    return this.users.filter(user => user.role === 'ADMIN').length;
  }

  toggleStatus(user: AdminUser): void {
    user.status = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    this.saveUsers();
  }

  makeAdmin(user: AdminUser): void {
    user.role = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    this.saveUsers();
  }

  deleteUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
    this.saveUsers();
  }
}
