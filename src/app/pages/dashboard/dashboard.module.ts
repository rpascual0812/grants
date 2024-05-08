import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { GrantTypesModule } from './grant-types/grant-types.module';
import { TotalGrantFunctionModule } from './total-grant-function/total-grant-function.module';
@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, GrantTypesModule, TotalGrantFunctionModule],
})
export class DashboardModule {}
