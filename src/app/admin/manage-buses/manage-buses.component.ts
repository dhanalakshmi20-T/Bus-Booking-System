import { Component } from '@angular/core';
import { BusService } from '../../services/bus.service';

@Component({
  selector: 'app-manage-buses',
  templateUrl: './manage-buses.component.html',
  styleUrl: './manage-buses.component.css'
})
export class ManageBusesComponent {
  buses: any;
  constructor(private service: BusService) {}

  ngOnInit() {
    this.service.getBuses().subscribe((data)=>{
      this.buses = data;
    })
  }
}
