import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportBeneficiariesComponent } from './report-beneficiaries.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'src/app/components/select/select.module';



@NgModule({
    declarations: [
        ReportBeneficiariesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule
    ],
    exports: [ReportBeneficiariesComponent]
})
export class ReportBeneficiariesModule { }
