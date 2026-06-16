import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusService } from '../../../core/services/bus.service';

@Component({
  selector: 'app-manage-buses',
  templateUrl: './manage-buses.component.html',
  styleUrls: ['./manage-buses.component.scss']
})
export class ManageBusesComponent implements OnInit {
  buses: any[] = [];
  form: FormGroup;
  editingId: string | null = null;
  message = '';

  constructor(private busService: BusService, private fb: FormBuilder) {
    this.form = this.fb.group({
      busName: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      date: ['', Validators.required],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      fare: ['', [Validators.required, Validators.min(1)]],
      totalSeats: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void { this.loadBuses(); }

  loadBuses(): void {
    this.busService.getAllBuses().subscribe(data => this.buses = data);
  }

  submit(): void {
    if (this.form.invalid) return;
    const action = this.editingId
      ? this.busService.updateBus(this.editingId, this.form.value)
      : this.busService.createBus(this.form.value);

    action.subscribe({
      next: () => {
        this.message = this.editingId ? 'Bus updated!' : 'Bus added!';
        this.form.reset();
        this.editingId = null;
        this.loadBuses();
      },
      error: (err) => this.message = err.error?.message || 'Error'
    });
  }

  edit(bus: any): void {
    this.editingId = bus._id;
    this.form.patchValue(bus);
  }

  delete(id: string): void {
    this.busService.deleteBus(id).subscribe(() => { this.message = 'Bus deleted.'; this.loadBuses(); });
  }
}
