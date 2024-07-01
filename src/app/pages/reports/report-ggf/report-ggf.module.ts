import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportGgfComponent } from './report-ggf.component';
import { BaseChartDirective } from 'ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [ReportGgfComponent],
    imports: [CommonModule, BaseChartDirective, BsDatepickerModule.forRoot()],
    exports: [ReportGgfComponent],
})
export class ReportGgfModule {}
