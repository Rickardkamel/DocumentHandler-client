import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { OrderComponent } from './order.component';
import { CreateOrderComponent } from './create-order.component';
import { EditOrderComponent } from './edit-order.component';

const orderRoutes: Routes = [
  { path: 'order', component: OrderComponent},
  { path: 'order/create', component: CreateOrderComponent},
  { path: 'order/edit/:id', component: EditOrderComponent},
];

export const orderRouting: ModuleWithProviders = RouterModule.forChild(orderRoutes);
