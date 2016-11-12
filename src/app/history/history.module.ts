import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { TypeaheadModule } from 'ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap';

import { HistoryComponent } from './history.component';
import { HistoryListComponent } from './history-list.component';
import { HistoryService } from './history.service';
import { historyRouting } from './history.routing';




@NgModule({
    imports: [
        SharedModule,
        historyRouting,
        TypeaheadModule,
        ModalModule,
    ],
    exports: [],
    declarations: [
        HistoryComponent,
        HistoryListComponent,

    ],
    providers: [HistoryService]
})
export class HistoryModule { }
