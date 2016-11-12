import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login';
import { HeaderService } from './header/header.service';

// Routing
import { appRouting } from './app.routing';

// Modules
import { OrderModule } from './order/order.module';
import { RegionModule } from './regions/regions.module';
import { HistoryModule } from './history/history.module';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule, TypeaheadModule } from 'ng2-bootstrap';
import {GlobalEventsManager} from './shared/globalEventsManager';
import {AuthService} from './shared/auth.service';
import {GlobalVariablesService} from './shared/global-variables.service';
import {PrintService} from './shared/print.service';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        ModalModule,
        TypeaheadModule,
        HttpModule,
        appRouting,
        ReactiveFormsModule,
        OrderModule,
        RegionModule,
        HistoryModule,
    ],
    exports: [
        ModalModule,
        BrowserModule,
        TypeaheadModule,
    ],
    bootstrap: [AppComponent],
    providers: [
        GlobalEventsManager,
        AuthService,
        GlobalVariablesService,
        PrintService,
        HeaderService,
        {provide: LocationStrategy,
        useClass: HashLocationStrategy}
    ]
})

export class AppModule { }
