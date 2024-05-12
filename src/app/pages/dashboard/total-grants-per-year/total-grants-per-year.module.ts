import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalGrantsPerYearComponent } from './total-grants-per-year.component';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
    declarations: [TotalGrantsPerYearComponent],
    exports: [TotalGrantsPerYearComponent],
    imports: [CommonModule, BaseChartDirective],
})
export class TotalGrantsPerYearModule {}
