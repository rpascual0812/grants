import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialManagementCapacityComponent } from './financial-management-capacity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        FinancialManagementCapacityComponent
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        FinancialManagementCapacityComponent
    ]
})
export class FinancialManagementCapacityModule { }
