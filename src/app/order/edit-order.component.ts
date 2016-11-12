// Angular
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import {TYPEAHEAD_DIRECTIVES} from 'ng2-bootstrap';
import { Subscription } from 'rxjs/RX';

// Service
import { OrderService } from './order.service';

// Interface
import { IReport, IVessel, IArticle, ICustomer, ITransporter, IRegion, IWaste, IReciever } from '../shared/';


@Component({
  selector: 'app-edit-order',
  templateUrl: 'edit-order.component.html',
})
export class EditOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  reportToEdit: IReport;
  reportId: number;
  private subscription: Subscription;
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
  currentRegion: IRegion;
  isGotten: boolean = false;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {

    this.subscription = activatedRoute.params.subscribe(
      (param: any) => this.reportId = param['id']
    );

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



    this.orderService.getReport(this.reportId)
      .subscribe(report => {
        this.reportToEdit = report;

        this.getReportInfo();
      });



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

    // let formDate = new Date;
    // this.onInput(formDate);

    this.orderService.getCustomers()
      .subscribe(customers => this.customerComplex = customers,
      error => this.errorMessage = <any>error);

    this.orderService.getRegions()
      .subscribe(regions => this.regions = regions,
      error => this.errorMessage = <any>error);

    this.orderService.getVessels()
      .subscribe(vessels => this.vesselComplex = vessels,
      error => this.errorMessage = <any>error);

    this.orderService.getWastes()
      .subscribe(wastes => this.wasteComplex = wastes,
      error => this.errorMessage = <any>error);

  }

  // MAKE ALL CALLS WHEN REPORT IS READY //
  getReportInfo() {
    this.orderService.getTransporter(this.reportToEdit.transporter.id)
      .subscribe(transporterCustomer => {
        this.transporterCustomer = transporterCustomer;
        this.transporterChanged(true);
      },
      error => this.errorMessage = <any>error);

    this.orderService.getReciever(this.reportToEdit.reciever.id)
      .subscribe(recieverCustomer => {
        this.recieverCustomer = recieverCustomer;
        this.recieverChanged(true);
      },
      error => this.errorMessage = <any>error);

    this.customer = this.reportToEdit.customer;

    this.report.info = this.reportToEdit.info;

    this.currentRegion = this.reportToEdit.region;
    this.removeRow(0, 0);

    for (let x = 0; x < this.reportToEdit.articles.length; x++) {
      this.orderService.getWaste(this.reportToEdit.articles[x].wasteId)
        .subscribe(currentWaste => {
          this.isGotten = true;

          this.reportToEdit.articles[x].waste = currentWaste;
          this.articles.push(this.buildExistingGroup(this.reportToEdit.articles[x]));
        });
    }

    this.onInput(this.reportToEdit.orderedDate);

  }

  buildExistingGroup(x): FormGroup {
    return this.fb.group({
      id: x.id,
      info: x.info,
      quantity: x.quantity,
      exchange: x.exchange,
      wasteId: x.wasteId,
      waste: this.fb.group({
        id: x.waste.id,
        text: x.waste.text,
        europeanWasteCatalogueCode: x.waste.europeanWasteCatalogueCode,
        unTextGroup: x.waste.unTextGroup,
      }),
      vessel: this.fb.group({
        type: x.vessel.type,
        id: x.vessel.id,
        palletSpace: x.vessel.palletSpace
      }),
    });
  }

  addRow() {
    this.articles.push(this.buildGroup());
  }

  removeRow(index, articleId): void {
    this.articles.removeAt(index);
    if (articleId !== 0) {
      this.orderService.deleteArticle(articleId)
        .subscribe(articleRemoved => {

        });
    }
  }

  buildArray(): FormArray {
    this.articles = this.fb.array([
      this.buildGroup()
    ]);
    return this.articles;
  }

  buildGroup(): FormGroup {
    return this.fb.group({
      id: '',
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
    // Needed?
    this.customer = e.item;
  }

  onSelectedArticle(e: any, index: number) {
    this.myForm.value.articles[index].waste.text = e.text;
    this.myForm.value.articles[index].waste.unTextGroup = e.unTextGroup;
    this.myForm.value.articles[index].waste.europeanWasteCatalogueCode = e.europeanWasteCatalogueCode + ', ';
    this.myForm.value.articles[index].wasteId = e.id;
    this.myForm.value.articles[index].waste.id = e.id;

  }

  onSelectedVessel(e: any, index: number) {
    this.myForm.value.articles[index].vessel.type = e.type;
    this.myForm.value.articles[index].vessel.palletspace = e.palletSpace;
    this.myForm.value.articles[index].vessel.id = e.id;
  };



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
      id: this.reportToEdit.id,
      createdByUserName: this.reportToEdit.createdByUserName,
      orderedDate: this.formDate,
      createdDate: this.reportToEdit.createdDate,
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
        this.router.navigate(['/regions/' + this.myForm.value.region.id ]);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
