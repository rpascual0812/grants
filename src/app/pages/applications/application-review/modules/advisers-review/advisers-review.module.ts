import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvisersReviewComponent } from './advisers-review.component';

@NgModule({
    declarations: [AdvisersReviewComponent],
    exports: [AdvisersReviewComponent],
    imports: [CommonModule, NgSelectModule],
})
export class AdvisersReviewModule {}
