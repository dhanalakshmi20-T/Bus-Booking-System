import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusService } from '../../services/bus.service';

@Component({
  selector: 'app-add-bus',
  templateUrl: './add-bus.component.html',
  styleUrl: './add-bus.component.css'
})
export class AddBusComponent {
  AddBus: FormGroup = new FormGroup("");
  constructor(private fb: FormBuilder, private service: BusService, private router: Router) {
    this.AddBus = this.fb.group({
      id: ['', Validators.required],
      busImage: ['', Validators.required],
      busName: ['', Validators.required],
      busNumber: ['', Validators.required],
      date: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      departure: ['', Validators.required],
      arrival: ['', Validators.required],
      price: ['', Validators.required],
      seats: ['', Validators.required]
    })
  }

  result: any;
  addnow() {
    this.result = this.service.addBus(this.AddBus.value)
    alert(this.result)
    this.AddBus.reset();
    this.router.navigateByUrl("/admin/view")
  }
}
