import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InitialSubmissionComponent } from './initial-submission.component';

@NgModule({
    declarations: [
        InitialSubmissionComponent
    ],
    exports: [InitialSubmissionComponent],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class InitialSubmissionModule { }
