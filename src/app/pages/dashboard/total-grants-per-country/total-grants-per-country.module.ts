import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalGrantsPerCountryComponent } from './total-grants-per-country.component';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
    declarations: [TotalGrantsPerCountryComponent],
    exports: [TotalGrantsPerCountryComponent],
    imports: [CommonModule, BaseChartDirective],
})
export class TotalGrantsPerCountryModule {}
