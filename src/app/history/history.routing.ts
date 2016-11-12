import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { HistoryComponent } from './history.component';
import { HistoryListComponent } from './history-list.component';

const historyRoutes: Routes = [
    { path: 'history', component: HistoryComponent},
    // { path: 'regions/:id', component: RegionListComponent},
]

export const historyRouting: ModuleWithProviders = RouterModule.forChild(historyRoutes);
