import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportFggComponent } from './report-fgg.component';
import { BaseChartDirective } from 'ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [ReportFggComponent],
    imports: [CommonModule, BaseChartDirective, BsDatepickerModule.forRoot()],
    exports: [ReportFggComponent],
})
export class ReportFggModule {}
