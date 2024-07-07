import { CommonGrantsPerCountryChartModule } from './../../../components/common-grants-per-country-chart/common-grants-per-country-chart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalGrantsPerCountryComponent } from './total-grants-per-country.component';

@NgModule({
    declarations: [TotalGrantsPerCountryComponent],
    exports: [TotalGrantsPerCountryComponent],
    imports: [CommonModule, CommonGrantsPerCountryChartModule],
})
export class TotalGrantsPerCountryModule {}
