// import {SumPalletSpacePipe} from '../pipes/sum-palletspace.pipe';
// import {TruncatePipe} from '../pipes/truncate.pipe';
import { RegionsService } from './regions.service';
import { Component, OnInit } from '@angular/core';
import { IRegion } from '../shared/region.interface';
import { IReport } from '../shared/report.interface';
// import {DataTableDirectives} from 'angular2-datatable/datatable';
import { PrintService } from '../shared/print.service';
import { SummaryPrintService } from '../shared/summary-print.service';
import { OrderService } from '../order/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';
var imageInBytes;

@Component({
  selector: 'app-region-list',
  templateUrl: 'region-list.component.html',
})

export class RegionListComponent implements OnInit {

  region: IRegion;
  regions: Array<IRegion> = [];
  regionReports: Array<IReport> = [];
  selectedReport: IReport = null;
  totalPalletSpace: number = 0;
  approvedValue: boolean = true;
  customerUrl: string;
  currentRegion: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private regionService: RegionsService,
    private printService: PrintService,
    private orderService: OrderService,
    private summaryPrintService: SummaryPrintService,
  ) { }

  selectRegion(report: IReport) {
    this.selectedReport = report;
    this.currentRegion = report.region.name;
  }

  selectedRow = function (index) {
    this.row = index;
  };

  getTotalPalletSpace(): number {
    let sum = 0;
    this.regionReports.forEach((regionReport) => {
      regionReport.articles.forEach((article) => {
        sum += article.vessel.palletSpace * article.quantity;
      });
    });
    return sum;
  }

  changeRegion(region: any) {
    this.selectedReport.region = region;
  }

  editDocument(reportId: number) {
    this.router.navigate(['/order/edit', reportId]);
  }

  getCheckedReports() {

    let selected = this.regionReports.filter((x) => x.approved);
    // APPROVED LOGIC
    selected.forEach(element => {
      this.regionService.postReport(element)
        .subscribe((response => {
          this.regionReports.splice(this.regionReports.indexOf(element), 1);
        }));
    });
      this.printSummary(selected);
  }

  updateCheckValue(report) {
    if (this.approvedValue === true) {
      this.approvedValue = false;
    }
    report.approved = (report.approved) ? false : true;
  }

  onSave() {
    this.regionService.postReport(this.selectedReport).subscribe(
      (response) => {
        if (this.selectedReport.region.name !== this.currentRegion) {
          this.regionReports.splice(this.regionReports.indexOf(this.selectedReport), 1);
        }
      });
  }

  isDateDayOld(dateToCheck: string) {
    let reference = moment();
    let aWeekOld = reference.clone().subtract(14, 'days').startOf('day');

    function isWithinAWeek(momentDate) {
      return momentDate.isAfter(aWeekOld);
    }
    function isTwoWeeksOrMore(momentDate) {
      return !isWithinAWeek(momentDate);
    }
    return isTwoWeeksOrMore(moment(dateToCheck));
  }

  ngOnInit() {
    let hasToken = window.localStorage.getItem('token');
    if (hasToken === null) {
      this.router.navigate(['/login']);
    }

    let routeId = this.route.snapshot.params['id'];
    this.regionService.getRegionReports(routeId).subscribe(
      (data) => {
        const myArray = [];
        for (let key in data) {
          if (key != null) {
            myArray.push(data[key]);
          }
        }
        this.regionReports = myArray;
        this.totalPalletSpace = this.getTotalPalletSpace();

        for (let x in this.regionReports) {
          if (x != null) {
            for (let i = 0; i < this.regionReports[x].articles.length; i++) {
              this.regionService.getWaste(this.regionReports[x].articles[i].wasteId)
                .subscribe(currentWaste => {
                  this.regionReports[x].articles[i].waste = currentWaste;
                });
            }
          }
        }

      }
    );

    this.regionService.get().subscribe(
      (data) => {
        const regionArray = [];
        for (let region in data) {
          if (region != null) {
            regionArray.push(data[region]);
          }
        }
        this.regions = regionArray;
      }
    );
    this.regionService.getById(routeId).subscribe(
      (data) => this.region = data
    );


    this.toDataUrl('assets/images/customer.png', function (base64Img) {
      imageInBytes = base64Img;
    });

  }

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
    this.printService.buildPdf(report, imageInBytes);    
  }

  printSummary(reports) {
    this.summaryPrintService.buildPdf(reports);
  }
}











