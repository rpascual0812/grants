import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }, {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
            }
        ]
    }, {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule)
            }
        ]
    }, {
        path: '**',
        redirectTo: 'dashboard'
    }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: false
        })
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
