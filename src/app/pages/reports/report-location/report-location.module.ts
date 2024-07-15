import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportLocationComponent } from './report-location.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SelectModule } from 'src/app/components/select/select.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [ReportLocationComponent],
    imports: [FormsModule, CommonModule, GoogleChartsModule, BsDatepickerModule.forRoot(), SelectModule],
    exports: [ReportLocationComponent],
})
export class ReportLocationModule {}
