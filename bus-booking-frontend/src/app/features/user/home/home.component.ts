import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  from = '';
  to = '';
  date = '';

  constructor(private router: Router) { }

  search(): void {
    this.router.navigate(['/search'], { queryParams: { from: this.from, to: this.to, date: this.date } });
  }

}
