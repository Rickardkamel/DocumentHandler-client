import { AuthService } from '../shared/auth.service';
import { GlobalVariablesService } from '../shared/global-variables.service';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { IReport, ICustomer, ITransporter, IRegion, IReciever, IArticle, IVessel, IWaste } from '../shared/';
import { Observable } from 'rxjs/observable';
import 'rxjs/Rx';

@Injectable()
export class HistoryService {
        private apiUrl = this.globalVariables.apiUrl;
        headers = this.authService.getAccessTokenHeader();

        constructor(private http: Http,
                private globalVariables: GlobalVariablesService,
                private authService: AuthService) { }

        getReports() {
                return this.http.get(this.apiUrl + 'api/report')
                        .map((response: Response) => <IReport[]>response.json());
        }

        getCustomers() {
                return this.http.get(this.apiUrl + 'api/Customer')
                        .map((response: Response) => <ICustomer[]>response.json());
        }

        getSearchedReports(searchParameter: string, selector: string) {
                return this.http.get(this.apiUrl + 'api/report/' + selector + '/' + searchParameter + '/1')
                        .map((response: Response) => response.json());
        }

        getWaste(report: IReport) {
                return this.http.get(this.apiUrl + 'api/report/getReportWaste/' + report.id)
                        .map((response: Response) => response.json());
        }
}
