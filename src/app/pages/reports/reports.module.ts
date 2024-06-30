import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportGgfModule } from './report-ggf/report-ggf.module';
import { ReportFggModule } from './report-fgg/report-fgg.module';
import { ReportBeneficiariesModule } from './report-beneficiaries/report-beneficiaries.module';
import { ReportApplicationModule } from './report-application/report-application.module';
import { ReportLocationModule } from './report-location/report-location.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        ReportsComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ReportGgfModule,
        ReportFggModule,
        ReportBeneficiariesModule,
        ReportApplicationModule,
        ReportLocationModule
    ],
    exports: [ReportsComponent]
})
export class ReportsModule { }
