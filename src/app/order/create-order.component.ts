// Angular
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
// Library
// import {TYPEAHEAD_DIRECTIVES} from 'ng2-bootstrap';
// Service
import { OrderService } from './order.service';
// Interface
import { IVessel, IReport, IArticle, ICustomer, ITransporter, IRegion, IWaste, IReciever } from '../shared/';
import { EmptyPrintService } from '../shared/empty-print.service';
var imageInBytes;

@Component({
  selector: 'app-create-order',
  templateUrl: 'create-order.component.html',

})
export class CreateOrderComponent implements OnInit, AfterViewInit {

  myForm: FormGroup;
  report = <IReport>{ articles: [{}] };
  regions: Array<IRegion>;
  customer = <ICustomer>{};
  transporter = <ITransporter>{};
  transporterCustomer = <ITransporter>{};
  reciever = <IReciever>{};
  recieverCustomer = <IReciever>{};
  latestReportId: number;
  articleList: IArticle[] = [];
  waste = <IWaste>{};
  formDate: Date;
  articles: FormArray;
  customerId: number;
  ifEmptyVessel: IVessel = {
    type: 'Annat',
    id: 25,
    palletSpace: 0
  };

  errorMessage: string;
  private customerComplex: Array<any>;
  private vesselComplex: Array<any>;
  private wasteComplex: Array<any>;
  cbReciever: boolean = true;
  cbTransporter: boolean = true;
  wasteId: string;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private fb: FormBuilder,
    private emptyPrintService: EmptyPrintService
  ) {
  }

  ngAfterViewInit() {
    this.reciever.name = this.recieverCustomer.name;
    this.reciever.adress = this.recieverCustomer.adress;
    this.reciever.city = this.recieverCustomer.city;
    this.reciever.corporateIdentity = this.recieverCustomer.corporateIdentity;
  }
  ngOnInit() {
    let hasToken = window.localStorage.getItem('token');
    if (hasToken === null) {
      this.router.navigate(['/login']);
    }

    this.myForm = this.fb.group({
      customer: this.fb.group({
        id: '',
        custNumber: '',
        name: '',
        adress: '',
        city: '',
        corporateIdentity: '',
        tel: '',
      }),
      reciever: this.fb.group({
        id: '',
        name: '',
        adress: '',
        city: '',
        corporateIdentity: '',
      }),
      transporter: this.fb.group({
        id: '',
        name: '',
        adress: '',
        city: '',
        corporateIdentity: '',
      }),
      articles: this.buildArray(),
      region: '',
      orderedDate: '',
      reportNr: '',
      info: '',
    });

    let formDate = new Date;
    this.onInput(formDate);

    this.orderService.getCustomers()
      .subscribe(customers => this.customerComplex = customers,
      error => this.errorMessage = <any>error);

    this.orderService.getTransporter(1)
      .subscribe(transporterCustomer => {
        this.transporterCustomer = transporterCustomer;
        this.transporterChanged(true);
      },
      error => this.errorMessage = <any>error);

    this.orderService.getReciever(1)
      .subscribe(recieverCustomer => {
        this.recieverCustomer = recieverCustomer;
        this.recieverChanged(true);
      },
      error => this.errorMessage = <any>error);

    this.orderService.getRegions()
      .subscribe(regions => this.regions = regions,
      error => this.errorMessage = <any>error);

    this.orderService.getVessels()
      .subscribe(vessels => this.vesselComplex = vessels,
      error => this.errorMessage = <any>error);

    this.orderService.getWastes()
      .subscribe(wastes => {
        this.wasteComplex = wastes;
      },
      error => this.errorMessage = <any>error);

    this.orderService.getLatestReportId()
      .subscribe(latestReportId => {
        this.latestReportId = latestReportId;
      },
      error => {
        this.errorMessage = <any>error;
        this.latestReportId = 2999;
      });

    this.toDataUrl('assets/images/customer.png', function (base64Img) {
      imageInBytes = base64Img;
    });

  }



  buildArray(): FormArray {
    this.articles = this.fb.array([
      this.buildGroup()
    ]);
    return this.articles;
  }

  buildGroup(): FormGroup {
    return this.fb.group({
      info: '',
      quantity: '',
      exchange: '',
      wasteId: '',
      waste: this.fb.group({
        id: '',
        text: '',
        europeanWasteCatalogueCode: '',
        unTextGroup: '',
      }),
      vessel: this.fb.group({
        type: '',
        id: '',
        palletSpace: ''
      }),
    });
  }

  public onSelectedCustomer(e: any) {

    this.myForm.value.customer = e.item;

    this.customerId = e.item.id;
    this.customer = e.item;
  }

  onSelectedArticle(e: any, index: number) {
    this.myForm.value.articles[index].waste.text = e.item.text;
    this.myForm.value.articles[index].waste.unTextGroup = e.item.unTextGroup;
    this.myForm.value.articles[index].waste.europeanWasteCatalogueCode = e.item.europeanWasteCatalogueCode + ', ';
    this.myForm.value.articles[index].wasteId = e.item.id;
    this.myForm.value.articles[index].waste.id = e.item.id;
  }

  onSelectedVessel(e: any, index: number) {
    this.myForm.value.articles[index].vessel.type = e.type;
    this.myForm.value.articles[index].vessel.palletSpace = e.palletSpace;
    this.myForm.value.articles[index].vessel.id = e.id;
  };

  addRow() {
    this.articles.push(this.buildGroup());
  }

  removeRow(index): void {
    this.articles.removeAt(index);
  }

  onInput(value: Date): void {
    this.formDate = value;
  }

  recieverChanged(value: boolean) {
    if (value) {
      this.reciever.name = this.recieverCustomer.name;
      this.reciever.adress = this.recieverCustomer.adress;
      this.reciever.city = this.recieverCustomer.city;
      this.reciever.corporateIdentity = this.recieverCustomer.corporateIdentity;
    } else {
      this.reciever.name = '';
      this.reciever.adress = '';
      this.reciever.city = '';
      this.reciever.corporateIdentity = '';
    }
  }

  transporterChanged(value: boolean) {
    if (value) {
      this.transporter.name = this.transporterCustomer.name;
      this.transporter.adress = this.transporterCustomer.adress;
      this.transporter.city = this.transporterCustomer.city;
      this.transporter.corporateIdentity = this.transporterCustomer.corporateIdentity;
    } else {
      this.transporter.name = '';
      this.transporter.adress = '';
      this.transporter.city = '';
      this.transporter.corporateIdentity = '';
    }
  }

  renderReport() {
    let today: Date = new Date;
    let loggedInUser = window.localStorage.getItem('user');

    let finishedReport = <IReport>{
      orderedDate: this.formDate,
      createdDate: today,
      createdByUserName: loggedInUser,
      info: this.myForm.value.info,
      lastEditBy: loggedInUser,
      editedDate: today,
      approved: false,
      articles: this.myForm.value.articles,
      customer: this.myForm.value.customer,
      reciever: this.myForm.value.reciever,
      region: this.myForm.value.region,
      transporter: this.myForm.value.transporter,
    };
    return finishedReport;
  }

  onSubmit() {
    let articlesInForm = this.myForm.value.articles;
    for (let i = 0; i < articlesInForm.length; i++) {
      if (articlesInForm[i].vessel.type.length < 2) {
        this.onSelectedVessel(this.ifEmptyVessel, i);
      }
    }

    this.myForm.value.customer.id = this.customerId;
    this.myForm.value.reciever.id = this.recieverCustomer.id;
    this.myForm.value.transporter.id = this.transporterCustomer.id;

    let report = this.renderReport();

    this.orderService.postReport(report)
      .subscribe(response => {
        this.router.navigate(['/']);
      }
      );
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

  onSave() {
    this.emptyPrintService.buildPdf(this.reciever, imageInBytes);
  }

}
