import {Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: 'history.component.html',
  // directives: [ROUTER_DIRECTIVES],
})
export class HistoryComponent implements OnInit {
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    let hasToken = window.localStorage.getItem('token');
    if (hasToken === null) {
      this.router.navigate(['/login']);
    }
  }

}
