import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonGrantsPerCountryChartComponent } from './common-grants-per-country-chart.component';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
    declarations: [CommonGrantsPerCountryChartComponent],
    imports: [CommonModule, BaseChartDirective],
    exports: [CommonGrantsPerCountryChartComponent],
})
export class CommonGrantsPerCountryChartModule {}
