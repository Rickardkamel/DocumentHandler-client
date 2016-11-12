import {GlobalEventsManager} from '../shared/globalEventsManager';
import { Router} from '@angular/router';
// import {Response} from '@angular/http';
import { FormGroup, FormControl} from '@angular/forms';
import {AuthService} from '../shared/auth.service';
import {Component} from '@angular/core';
import {OnInit} from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  // directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
})

export class LoginComponent implements OnInit {

  myForm: FormGroup;
  error: boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    private globalEventsManager: GlobalEventsManager) { }

  ngOnInit(): any {
    this.myForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  login() {
    this.authService.getToken(this.myForm.value).subscribe(
      (response) => {

        window.localStorage.setItem('token', response);
        window.localStorage.setItem('user', this.myForm.value.username);
        this.globalEventsManager.showNavBar.emit(true);
        this.router.navigate(['/regions']);
      },
      (error) => this.error = true
    );
  }
}
