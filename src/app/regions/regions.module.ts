import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { TypeaheadModule } from 'ng2-bootstrap';
import { ModalModule } from 'ng2-bootstrap';

import { RegionsComponent } from './regions.component';
import { RegionListComponent } from './region-list.component';
import { RegionsService } from './regions.service';
import { regionRouting } from './regions.routing';

import { TruncatePipe } from '../pipes/truncate.pipe';
import { SumPalletSpacePipe } from '../pipes/sum-palletspace.pipe';

@NgModule({
    imports: [
        SharedModule,
        regionRouting,
        TypeaheadModule,
        ModalModule,
    ],
    exports: [
    ],
    declarations: [
        RegionsComponent,
        RegionListComponent,
        SumPalletSpacePipe,
        TruncatePipe,
    ],
    providers: [RegionsService]
})
export class RegionModule { }
