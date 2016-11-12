import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { RegionsComponent } from './regions.component';
import { RegionListComponent } from './region-list.component';

const regionRoutes: Routes = [
    { path: 'regions', component: RegionsComponent},
    { path: '', component: RegionsComponent},
    { path: 'regions/:id', component: RegionListComponent},
];

export const regionRouting: ModuleWithProviders = RouterModule.forChild(regionRoutes);
