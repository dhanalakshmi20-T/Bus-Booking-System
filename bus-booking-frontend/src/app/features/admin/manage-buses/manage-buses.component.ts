import { Component, OnInit } from '@angular/core';

export interface AdminBus {
  id: number;
  busName: string;
  busNumber: string;
  busType: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  fare: number;
  status: 'ACTIVE' | 'INACTIVE';
}

@Component({
  selector: 'app-manage-buses',
  templateUrl: './manage-buses.component.html',
  styleUrls: ['./manage-buses.component.scss']
})
export class ManageBusesComponent implements OnInit {

  buses: AdminBus[] = [];
  searchText = '';
  showForm = false;
  editId: number | null = null;

  busForm: AdminBus = this.getEmptyBus();

  ngOnInit(): void {
    this.loadBuses();
  }

  private getEmptyBus(): AdminBus {
    return {
      id: 0,
      busName: '',
      busNumber: '',
      busType: 'AC',
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
      totalSeats: 40,
      availableSeats: 40,
      fare: 0,
      status: 'ACTIVE'
    };
  }

  private loadBuses(): void {
    const saved = localStorage.getItem('bb_admin_buses');

    if (saved) {
      this.buses = JSON.parse(saved);
      return;
    }

    this.buses = [
      {
        id: 1,
        busName: 'Royal Travels',
        busNumber: 'TN01AB1234',
        busType: 'AC',
        from: 'Chennai',
        to: 'Bangalore',
        departureTime: '06:00 AM',
        arrivalTime: '11:00 AM',
        totalSeats: 40,
        availableSeats: 18,
        fare: 350,
        status: 'ACTIVE'
      },

      {
        id: 2,
        busName: 'Sri Murugan Travels',
        busNumber: 'TN02CD5678',
        busType: 'NON-AC',
        from: 'Chennai',
        to: 'Bangalore',
        departureTime: '08:30 AM',
        arrivalTime: '02:00 PM',
        totalSeats: 45,
        availableSeats: 30,
        fare: 220,
        status: 'ACTIVE'
      }
    ];

    this.saveBuses();
  }

  private saveBuses(): void {
    localStorage.setItem('bb_admin_buses', JSON.stringify(this.buses));
  }

  get filteredBuses(): AdminBus[] {
    const term = this.searchText.trim().toLowerCase();

    if (!term) return this.buses;

    return this.buses.filter(bus =>
      bus.busName.toLowerCase().includes(term) ||
      bus.busNumber.toLowerCase().includes(term) ||
      bus.from.toLowerCase().includes(term) ||
      bus.to.toLowerCase().includes(term)
    );
  }

  openAddForm(): void {
    this.editId = null;
    this.busForm = this.getEmptyBus();
    this.showForm = true;
  }
  
  editBus(bus: AdminBus): void {
    this.editId = bus.id;
    this.busForm = { ...bus };
    this.showForm = true;
  }

  saveBus(): void {
    if (this.editId) {
      this.buses = this.buses.map(bus => bus.id === this.editId ? { ...this.busForm, id: this.editId } : bus);
    }
    else {
      this.buses.unshift({
        ...this.busForm,
        id: Date.now()
      });
    }

    this.saveBuses();
    this.cancelForm();
  }

  deleteBus(id: number): void {
    this.buses = this.buses.filter(bus => bus.id !== id);
    this.saveBuses();
  }

  toggleStatus(bus: AdminBus): void {
    bus.status = bus.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.saveBuses();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editId = null;
    this.busForm = this.getEmptyBus();
  }
}
