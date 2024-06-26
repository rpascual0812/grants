import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdvisersReviewComponent } from './advisers-review.component';

@NgModule({
    declarations: [AdvisersReviewComponent],
    exports: [AdvisersReviewComponent],
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class AdvisersReviewModule { }
