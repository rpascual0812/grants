import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';
import { BaseChartDirective } from 'ng2-charts';
import { CommonGrantsPerCountryChartModule } from 'src/app/components/common-grants-per-country-chart/common-grants-per-country-chart.module';

@NgModule({
    declarations: [SummaryComponent],
    imports: [CommonModule, BaseChartDirective, CommonGrantsPerCountryChartModule],
    exports: [SummaryComponent ],
})
export class SummaryModule {}
