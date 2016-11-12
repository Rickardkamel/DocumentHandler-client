import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';
import { HistoryService } from './history.service';
import { IReport, IArticle, ICustomer } from '../shared/';
import { PrintService } from '../shared/print.service';
import { Observable } from 'rxjs/Observable';

var imageInBytes;

@Component({
  selector: 'app-history-list',
  templateUrl: 'history-list.component.html',
})

export class HistoryListComponent implements OnInit {
  private data: any[];
  private selectedReport: any = null;
  searchCriteriaForm: FormGroup;
  reportComplex: Array<any>;
  selectedCustomer: ICustomer;
  customerNameSelected: boolean = false;
  reportIdSelected: boolean = false;
  customerCitySelected: boolean = false;
  selectStartValue: any = 'customerName';

  showingSpecificReport: boolean = false;

  @ViewChild('childModal') public childModal: ModalDirective;
  constructor(
    private historyService: HistoryService,
    private router: Router,
    private printService: PrintService
  ) { }

  public showChildModal(): void {
    this.childModal.show();
  }


  public hideChildModal(): void {
    this.childModal.hide();
  }

  public selectReport(report: IReport) {
    this.selectedReport = report;
  }

  public showAllReports() {
    this.historyService.getReports()
      .subscribe(reports => {
        this.data = reports;
      });
    this.showingSpecificReport = !this.showingSpecificReport;
  }

  public isApproved(value: boolean) {
    return value;
  }

  public onSelectedCustomer(e: any) {

    // for (let i = 0; i < this.data.length; i++) {
    //   if (this.data[i].customer.name === e.item.name) {
    //     this.completedList.push(this.data[i]);
    //   }
    // }
    // this.data = this.completedList;
    // this.showingSpecificReport = !this.showingSpecificReport;
  }

  ngOnInit() {
    let hasToken = window.localStorage.getItem('token');

    if (hasToken === null) {
      this.router.navigate(['/login']);
    }

    this.historyService.getReports()
      .subscribe(reports => {
        this.data = reports;
        this.reportComplex = this.data;
      });

    this.searchCriteriaForm = new FormGroup({
      selectedParam: new FormControl(),
      searchParam: new FormControl(),
    });

    this.toDataUrl('assets/images/customer.png', function (base64Img) {
      imageInBytes = base64Img;
    });
  }

  onDetailedSearch(searchCriteria: any) {
    this.historyService.getSearchedReports
      (this.searchCriteriaForm.value.searchParam, this.searchCriteriaForm.value.selectedParam)
      .subscribe(x => {
        this.data = x;
        if (this.showingSpecificReport === false) {
          this.showingSpecificReport = !this.showingSpecificReport;
        }
      });
  }

  selectedRow = function (index) {
    this.row = index;
  };

  toDataUrl(src, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL('image/png');
      callback(dataURL);
    };
    img.src = src;
  }

  printDocument(report: IReport) {

    this.historyService.getWaste(report)
      .subscribe(newReport => {
        this.printService.buildPdf(newReport, imageInBytes);
      });
  }
}
