import { AuthService } from '../shared/auth.service';
import { GlobalVariablesService } from '../shared/global-variables.service';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';

import 'rxjs/Rx';

@Injectable()
export class HeaderService {
    private apiUrl = this.globalVariables.apiUrl;
    constructor(private http: Http,
        private globalVariables: GlobalVariablesService,
        private authService: AuthService) { }

    postRegion(regionName: string) {
        let region = {
            name: regionName
        };

        let body = JSON.stringify(region);
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this.http.post(this.apiUrl + 'api/region/', body, { headers: headers }).map(
            (response: Response) => response.json()
        );
    }

    getRegions() {
        let headers = this.authService.getAccessTokenHeader();
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this.apiUrl + 'api/region', options)
            .map((response: Response) => response.json());
    }
}
