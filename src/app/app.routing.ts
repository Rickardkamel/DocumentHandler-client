import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '/regions', pathMatch: 'full'},
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
