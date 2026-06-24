import { Component, OnInit } from '@angular/core';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: 'booking' | 'offer' | 'system' | 'payment';
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications: AppNotification[] = [];

  ngOnInit(): void {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    const saved = localStorage.getItem('bbo_notifications');

    if (saved) {
      this.notifications = JSON.parse(saved);
      return;
    }

    this.notifications = [
      {
        id: 1,
        title: 'Booking Confirmed',
        message: 'Your recent bus ticket has been confirmed successfully.',
        type: 'booking',
        time: 'Today, 10:30 AM',
        read: false
      },

      {
        id: 2,
        title: 'Journey Reminder',
        message: 'Your upcoming trip starts soon. Please reach the boarding point on time.',
        type: 'system',
        time: 'Yesterday, 6:15 PM',
        read: false
      },

      {
        id: 3,
        title: 'Payment Successful',
        message: 'Your payment was received and your booking is now active.',
        type: 'payment',
        time: '2 days ago',
        read: true
      },

      {
        id: 4,
        title: 'Weekend Offer',
        message: 'Save more on your next trip with selected route offers.',
        type: 'offer',
        time: '3 days ago',
        read: true
      }
    ];

    this.saveNotifications();
  }

  private saveNotifications(): void {
    localStorage.setItem('bb_notifications', JSON.stringify(this.notifications));
  }

  markAsRead(notification: AppNotification): void {
    notification.read = true;
    this.saveNotifications();
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(item => ({
      ...item,
      read: true
    }));

    this.saveNotifications();
  }

  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter(item => item.id !== id);
    this.saveNotifications();
  }

  clearAll(): void {
    this.notifications = [];
    this.saveNotifications();
  }

  get unreadCount(): number {
    return this.notifications.filter(item => !item.read).length;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'booking':
        return 'bi-ticket-perforated-fill';

      case 'payment':
        return 'bi-credit-card-fill';

      case 'offer':
        return 'bi-gift-fill';

      default:
        return 'bi-bell-fill';
    }
  }
}
