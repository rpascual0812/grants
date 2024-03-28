import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DueDiligenceFinalReviewComponent } from './due-diligence-final-review.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'src/app/components/select/select.module';

@NgModule({
    declarations: [
        DueDiligenceFinalReviewComponent
    ],
    exports: [
        DueDiligenceFinalReviewComponent
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule
    ]
})
export class DueDiligenceFinalReviewModule { }
