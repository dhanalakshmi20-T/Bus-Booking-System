import { Component, OnInit } from '@angular/core';

import { Bus } from '../../../core/models/bus.model';
import { BusService } from '../../../core/services/bus.service';

@Component({
  selector: 'app-manage-buses',
  templateUrl: './manage-buses.component.html',
  styleUrls: ['./manage-buses.component.scss']
})
export class ManageBusesComponent implements OnInit {

  buses: Bus[] = [];
  searchText = '';

  showForm = false;
  editId: string | number | null = null;

  isLoading = true;
  isSaving = false;
  errorMessage = '';

  busForm: Partial<Bus> = this.getEmptyBus();

  constructor(private busService: BusService) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  private getEmptyBus(): Partial<Bus> {
    return {
      busName: '',
      busNumber: '',
      busType: 'AC',
      from: '',
      to: '',
      date: '',
      departureTime: '',
      arrivalTime: '',
      totalSeats: 40,
      fare: 0,
      status: 'ACTIVE'
    };
  }

  private loadBuses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.busService.getAllBuses().subscribe({
      next: buses => {
        this.buses = buses;
        this.isLoading = false;
      },
      error: error => {
        this.buses = [];
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          'Unable to load buses.';
      }
    });
  }

  get filteredBuses(): Bus[] {
    const term = this.searchText
      .trim()
      .toLowerCase();

    if (!term) {
      return this.buses;
    }

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
    this.errorMessage = '';
    this.showForm = true;
  }

  editBus(bus: Bus): void {
    this.editId = bus.id;
    this.busForm = { ...bus };
    this.errorMessage = '';
    this.showForm = true;
  }

  saveBus(): void {
    this.errorMessage = '';

    const requiredValues = [
      this.busForm.busName,
      this.busForm.busNumber,
      this.busForm.busType,
      this.busForm.from,
      this.busForm.to,
      this.busForm.date,
      this.busForm.departureTime,
      this.busForm.arrivalTime
    ];

    if (requiredValues.some(value => !String(value || '').trim())) {
      this.errorMessage =
        'Please complete all bus details.';
      return;
    }

    if (
      Number(this.busForm.totalSeats) <= 0 ||
      Number(this.busForm.fare) <= 0
    ) {
      this.errorMessage =
        'Seats and fare must be greater than zero.';
      return;
    }

    const request: Partial<Bus> = {
      ...this.busForm,
      busName: this.busForm.busName?.trim(),
      busNumber: this.busForm.busNumber
        ?.trim()
        .toUpperCase(),
      from: this.busForm.from?.trim(),
      to: this.busForm.to?.trim()
    };

    this.isSaving = true;

    const saveRequest = this.editId !== null
      ? this.busService.updateBus(this.editId, request)
      : this.busService.addBus(request);

    saveRequest.subscribe({
      next: savedBus => {
        if (this.editId !== null) {
          this.buses = this.buses.map(bus =>
            bus.id === this.editId ? savedBus : bus
          );
        } else {
          this.buses = [savedBus, ...this.buses];
        }

        this.isSaving = false;
        this.cancelForm();
      },
      error: error => {
        this.isSaving = false;
        this.errorMessage =
          error.error?.message ||
          'Unable to save the bus.';
      }
    });
  }

  toggleStatus(bus: Bus): void {
    const status =
      bus.status === 'ACTIVE'
        ? 'INACTIVE'
        : 'ACTIVE';

    this.busService
      .updateBus(bus.id, { status })
      .subscribe({
        next: updatedBus => {
          this.buses = this.buses.map(item =>
            item.id === bus.id ? updatedBus : item
          );
        },
        error: error => {
          this.errorMessage =
            error.error?.message ||
            'Unable to update bus status.';
        }
      });
  }

  deleteBus(id: string | number): void {
    const confirmed = window.confirm(
      'Delete this bus permanently?'
    );

    if (!confirmed) {
      return;
    }

    this.busService.deleteBus(id).subscribe({
      next: () => {
        this.buses = this.buses.filter(
          bus => bus.id !== id
        );
      },
      error: error => {
        this.errorMessage =
          error.error?.message ||
          'Unable to delete the bus.';
      }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editId = null;
    this.busForm = this.getEmptyBus();
  }
}