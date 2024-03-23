import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentComponent } from './assessment.component';



@NgModule({
  declarations: [
    AssessmentComponent
  ],
  exports: [
    AssessmentComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class AssessmentModule { }
