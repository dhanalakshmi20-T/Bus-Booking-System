import { Component, OnInit } from '@angular/core';

import { UserSummary } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: UserSummary[] = [];
  searchText = '';
  roleFilter = 'ALL';
  isLoading = true;
  processingId = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.isLoading = false;
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to load users.';
        this.isLoading = false;
      }
    });
  }

  get filteredUsers(): UserSummary[] {
    const term = this.searchText.trim().toLowerCase();
    return this.users.filter(user => {
      const matchesRole = this.roleFilter === 'ALL' || user.role === this.roleFilter;
      const searchable = `${user.name} ${user.email} ${user.phone || ''}`.toLowerCase();
      return matchesRole && (!term || searchable.includes(term));
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

  toggleStatus(user: UserSummary): void {
    const status = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    this.updateUser(user, this.userService.updateStatus(user.id, status));
  }

  makeAdmin(user: UserSummary): void {
    const role = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    this.updateUser(user, this.userService.updateRole(user.id, role));
  }

  private updateUser(user: UserSummary, request: ReturnType<UserService['updateStatus']>): void {
    this.processingId = user.id;
    this.errorMessage = '';
    request.subscribe({
      next: updated => {
        this.users = this.users.map(item => item.id === user.id ? updated : item);
        this.processingId = '';
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to update user.';
        this.processingId = '';
      }
    });
  }

  deleteUser(user: UserSummary): void {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    this.processingId = user.id;
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(item => item.id !== user.id);
        this.processingId = '';
      },
      error: error => {
        this.errorMessage = error.error?.message || 'Unable to delete user.';
        this.processingId = '';
      }
    });
  }
}
