import { AuthService } from '../shared/auth.service';
import { GlobalVariablesService } from '../shared/global-variables.service';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { IReport } from '../shared/';

import 'rxjs/Rx';

@Injectable()
export class RegionsService {
    private apiUrl = this.globalVariables.apiUrl;
    constructor(private http: Http,
        private globalVariables: GlobalVariablesService,
        private authService: AuthService) { }

    get() {
        let headers = this.authService.getAccessTokenHeader();
        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this.apiUrl + 'api/region', options)
            .map((response: Response) => response.json());
    }

    post(regionName: string) {
        let region = {
            name: regionName
        };

        let body = JSON.stringify(region);
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        let options = new RequestOptions({ headers: headers, body: body });

        return this.http.post(this.apiUrl + 'api/region/', options).map(
            (response: Response) => response.json()
        );
    }

    postReport(report: IReport) {

        let body = JSON.stringify(report);
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        // let options = new RequestOptions({ headers: headers, body: body });

        return this.http.post(this.apiUrl + 'api/report', body, { headers: headers })
            // .map((data) => data.json());
    }

    getById(id: number) {
        return this.http.get(this.apiUrl + 'api/region/' + id)
            .map((response: Response) => response.json());
    }

    getDetailed() {
        let headers = this.authService.getAccessTokenHeader();

        let options = new RequestOptions({ headers: headers, body: '' });

        return this.http.get(this.apiUrl + 'api/region/detailed', options)
            .map((response: Response) => response.json());
    }

    getRegionReports(id: number) {
        let body = '';
        return this.http.get(this.apiUrl + 'api/region/reports/' + id, { body })
            .map((response: Response) => response.json());
    }

    getSearchedReports(searchParameter: string, selector: string) {
        return this.http.get(this.apiUrl + 'api/report/' + selector + '/' + searchParameter + '/0')
            .map((response: Response) => response.json());
    }

    getWaste(id: string) {
        return this.http.get(this.apiUrl + 'api/waste/' + id)
            .map((response: Response) => response.json());
    }

    // getArticleSummary(reports: IReport[]) {
    //     let body = JSON.stringify(reports);

    //     let headers = new Headers({
    //         'Content-Type': 'application/json'
    //     });

    //     return this.http.get(this.apiUrl + 'api/article/getSummary?' + body, {headers: headers})
    //         .map((response: Response) => response.json());
    // }

}
