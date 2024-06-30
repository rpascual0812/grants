import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportLocationComponent } from './report-location.component';



@NgModule({
    declarations: [
        ReportLocationComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [ReportLocationComponent]
})
export class ReportLocationModule { }
