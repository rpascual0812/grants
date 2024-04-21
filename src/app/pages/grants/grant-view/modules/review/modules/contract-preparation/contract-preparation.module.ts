import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContractPreparationComponent } from './contract-preparation.component';

@NgModule({
    declarations: [
        ContractPreparationComponent
    ],
    exports: [ContractPreparationComponent],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class ContractPreparationModule { }
