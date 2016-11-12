import {AuthService} from '../shared/auth.service';
import {GlobalVariablesService} from '../shared/global-variables.service';
import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {IReport, ICustomer, ITransporter, IRegion, IReciever, IVessel, IWaste } from '../shared/';

import 'rxjs/Rx';

@Injectable()
export class OrderService {
        private baseUrl = this.globalVariables.apiUrl;
        headers = this.authService.getAccessTokenHeader();

        constructor(private http: Http,
                private globalVariables: GlobalVariablesService,
                private authService: AuthService) { }

        getCustomers() {
                return this.http.get(this.baseUrl + 'api/InfoFlexCustomer')
                        .map((response: Response) => <ICustomer[]>response.json());
        }

        getTransporter(id: number) {
                return this.http.get(this.baseUrl + 'api/transporter/' + id)
                        .map((response: Response) => <ITransporter>response.json());
        }

        getReciever(id: number) {
                return this.http.get(this.baseUrl + 'api/reciever/' + id)
                        .map((response: Response) => <IReciever>response.json());
        }

        getRegions() {
                return this.http.get(this.baseUrl + 'api/region')
                        .map((response: Response) => <IRegion[]>response.json());
        }

        getVessels() {
                return this.http.get(this.baseUrl + 'api/vessel')
                        .map((response: Response) => <IVessel[]>response.json());
        }

        getWastes() {
                return this.http.get(this.baseUrl + 'api/waste')
                        .map((response: Response) => <IWaste[]>response.json());
        }

        getLatestReportId() {
                let options = new RequestOptions({ headers: this.headers, body: '' });

                return this.http.get(this.baseUrl + 'api/report/getlatestid', options)
                        .map((response: Response) => response.json());
        }

        postReport(report: IReport) {
                let body = JSON.stringify(report);
                let headers = new Headers({
                        'Content-Type': 'application/json'
                });

                // let options = new RequestOptions({ headers, body });

                return this.http.post(this.baseUrl + 'api/report', body, { headers: headers });
                // .map((response: Response) => response.json());
        }

        deleteArticle(articleId: string) {
                return this.http.delete(this.baseUrl + 'api/article/' + articleId.toString());

        }

        // editReport(report: IReport) {

        //         let body = JSON.stringify(report);
        //         return this.http.post(this.baseUrl + 'api/report/editReport', body, { headers: this.headers });
        //         // .map((response: Response) => response.json());
        // }

        // -------------Get One--------------//

        getReport(id: number) {
                return this.http.get(this.baseUrl + 'api/report/' + id)
                        .map((response: Response) => response.json());
        }

        getWaste(id: string) {
                return this.http.get(this.baseUrl + 'api/waste/' + id)
                        .map((response: Response) => response.json());
        }

}
