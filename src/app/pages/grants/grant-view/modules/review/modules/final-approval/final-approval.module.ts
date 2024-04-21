import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FinalApprovalComponent } from './final-approval.component';

@NgModule({
    declarations: [
        FinalApprovalComponent
    ],
    exports: [FinalApprovalComponent],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class FinalApprovalModule { }
