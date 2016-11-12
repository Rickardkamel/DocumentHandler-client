import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { GlobalVariablesService } from './global-variables.service';
import { AuthService } from './auth.service';
import { PrintService } from './print.service';
import { SummaryPrintService } from './summary-print.service';
import { EmptyPrintService } from './empty-print.service';

import { DataTableDirectives } from 'angular2-datatable/datatable';

@NgModule({
    imports: [CommonModule],
    declarations: [
        // ??
        DataTableDirectives
    ],
    providers: [
        AuthService,
        GlobalVariablesService,
        PrintService,
        SummaryPrintService,
        EmptyPrintService
    ],
    exports: [
        // AuthService,
        // PrintService,
        ReactiveFormsModule,
        CommonModule,
        DataTableDirectives
    ]
})

export class SharedModule { }
