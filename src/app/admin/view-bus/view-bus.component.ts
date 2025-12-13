import { Component } from '@angular/core';
import { BusService } from '../../services/bus.service';

@Component({
  selector: 'app-view-bus',
  templateUrl: './view-bus.component.html',
  styleUrl: './view-bus.component.css'
})
export class ViewBusComponent {
  buses: any;
  constructor(private service: BusService) {}

  ngOnInit() {
    this.service.getBuses().subscribe((data)=>{
      this.buses = data;
    })
  }
}
