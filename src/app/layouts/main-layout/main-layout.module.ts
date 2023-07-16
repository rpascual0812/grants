import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainLayoutRoutes } from './main-layout.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MainLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    declarations: [

    ],

})
export class MainLayoutModule { }
