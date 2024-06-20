import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { GrantTypesModule } from './grant-types/grant-types.module';
import { TotalGrantFunctionModule } from './total-grant-function/total-grant-function.module';
import { TotalGrantsPerCountryModule } from './total-grants-per-country/total-grants-per-country.module';
import { TotalGrantsPerYearModule } from './total-grants-per-year/total-grants-per-year.module';
import { TotalPerDonorModule } from './total-per-donor/total-per-donor.module';
@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        GrantTypesModule,
        TotalGrantFunctionModule,
        TotalGrantsPerCountryModule,
        TotalGrantsPerYearModule,
        TotalPerDonorModule
    ],
})
export class DashboardModule { }
