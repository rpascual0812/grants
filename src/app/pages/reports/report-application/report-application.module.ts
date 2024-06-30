import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportApplicationComponent } from './report-application.component';



@NgModule({
    declarations: [
        ReportApplicationComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [ReportApplicationComponent]
})
export class ReportApplicationModule { }
