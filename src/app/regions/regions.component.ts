import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
// import { MODAL_DIRECTIVES, BS_VIEW_PROVIDERS } from 'ng2-bootstrap';
import { ModalDirective } from 'ng2-bootstrap';

// import { DataTableDirectives } from 'angular2-datatable/datatable';
import { RegionsService } from './regions.service';
import { IRegion, IReport } from '../shared/';

@Component({
  selector: 'app-regions',
  templateUrl: 'regions.component.html',
  // providers: [RegionsService],
  // viewProviders: [BS_VIEW_PROVIDERS],
})

export class RegionsComponent implements OnInit {
  createRegionForm: FormGroup;
  searchCriteriaForm: FormGroup;
  regions: Array<IRegion> = [];
  searchedReports: Array<IReport> = [];
  showAll: boolean = false;
  private data: any[];
  selectStartValue: any = 'customerName';
  searchParamValue: any;

  // private selectedReport: any = null;


  @ViewChild('lgModal') public lgModal: ModalDirective;

  constructor(
    private regionService: RegionsService,
    // private reportService: ReportService,
    private router: Router
  ) { }

  paramValue(param: string) {
    if (param === 'customerName') {
      return 'Kundnamn';
    } else if (param === 'id') {
      return 'Löpnummer';
    } else if (param === 'info') {
      return 'Rapportinfo';
    }
  }

  public selectReport(report: IReport) {
    // this.selectedReport = report;
    this.hideChildModal();
    this.router.navigate(['order/edit/' + report.id]);

  }

  public isApproved(value: boolean) {
    return value;
  }

  public showChildModal(x: any): void {
    this.lgModal.show();

    this.data = x;
  }


  public hideChildModal(): void {
    this.lgModal.hide();
  }

  ngOnInit() {
    let hasToken = window.localStorage.getItem('token');
    if (hasToken === null) {
      this.router.navigate(['/login']);
    }
    this.searchCriteriaForm = new FormGroup({
      selectedParam: new FormControl(),
      searchParam: new FormControl(),
    });
    this.createRegionForm = new FormGroup({
      regionName: new FormControl(),
    });
    this.getRegions();
  }


  onDetailedSearch(searchCriteria: any) {
    this.searchParamValue = this.paramValue(this.searchCriteriaForm.value.selectedParam);
    this.regionService.getSearchedReports
      (this.searchCriteriaForm.value.searchParam, this.searchCriteriaForm.value.selectedParam)
      .subscribe(value => {
        this.data = value;
        this.showChildModal(value);
      });
  }

  onCreateRegion(regionName: string) {
    this.regionService.post(regionName).subscribe(
      (res) => {
        this.regions.push(res);
      }
    );
  }

  onClick(id: number) {
    this.router.navigate(['/regions', id]);
  }

  getRegions() {
    this.regionService.getDetailed().subscribe(
      data => {
        const myArray = [];
        for (let key in data) {
          if (key != null) {
            myArray.push(data[key]);
          }
        }
        this.regions = myArray;
      }
    );
  }
}
