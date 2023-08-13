import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';

import { RolesComponent } from './roles.component';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
    declarations: [
        RolesComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgxPaginationModule,

        ComponentsModule
    ]
})
export class RolesModule { }
