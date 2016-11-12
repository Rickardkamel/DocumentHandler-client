import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { TypeaheadModule } from 'ng2-bootstrap';

import { OrderComponent } from './order.component';
import { CreateOrderComponent } from './create-order.component';
import { EditOrderComponent } from './edit-order.component';
import { OrderService } from './order.service';
import { orderRouting } from './order.routing';

@NgModule({
    imports: [
        SharedModule,
        orderRouting,
        TypeaheadModule,
    ],
    declarations: [
        OrderComponent,
        CreateOrderComponent,
        EditOrderComponent,
    ],
    providers: [OrderService]
})
export class OrderModule { }
