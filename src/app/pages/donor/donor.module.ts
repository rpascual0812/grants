import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonorComponent } from './donor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonorModalComponent } from './donor-modal/donor-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
    declarations: [
        DonorComponent,
        DonorModalComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgxPaginationModule,
        ComponentsModule
    ]
})
export class DonorModule { }
