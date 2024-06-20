import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalPerDonorComponent } from './total-per-donor.component';



@NgModule({
    declarations: [
        TotalPerDonorComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [TotalPerDonorComponent]
})
export class TotalPerDonorModule { }
