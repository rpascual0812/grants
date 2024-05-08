import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { TotalGrantFunctionModule } from './total-grant-function/total-grant-function.module';



@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule, TotalGrantFunctionModule
    ]
})
export class DashboardModule { }
