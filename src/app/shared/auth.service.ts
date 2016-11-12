import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {GlobalVariablesService} from './global-variables.service';
import {Http, Headers, Response} from '@angular/http';
import {User} from './user.interface';
import 'rxjs/Rx';

@Injectable()
export class AuthService {

    constructor(private http: Http, private router: Router, private globalVariables: GlobalVariablesService) {
    }

    login(user: User) {
        return this.http.post(this.globalVariables.apiUrl + 'account/login', user);
    }

    logout() {
        window.localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    isUserLoggedIn() {
        return window.localStorage.getItem('token') !== null ? true : false;
    }

    getAccessTokenHeader(): Headers {
        let token = localStorage.getItem('token');
        return new Headers({
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
        });
    }

    getToken(user: User) {
        let data = `grant_type=password&username=${user.username}&password=${user.password}`;
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        return this.http.post(this.globalVariables.apiUrl + 'token', data, headers).map(
            (response: Response) => response.json().access_token
        );
    }
}
