import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DueDiligenceFinalReviewComponent } from './due-diligence-final-review.component';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    DueDiligenceFinalReviewComponent
  ],
  exports: [
    DueDiligenceFinalReviewComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule
  ]
})
export class DueDiligenceFinalReviewModule { }
