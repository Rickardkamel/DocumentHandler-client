import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  template: `
  <router-outlet></router-outlet>
  `,
})
export class OrderComponent implements OnInit {

  constructor(
    orderService: OrderService,
    private router: Router
    ) { }

  ngOnInit() {
    let hasToken = window.localStorage.getItem('token');
    if (hasToken === null) {
      this.router.navigate(['/login']);
    }
  }

}
