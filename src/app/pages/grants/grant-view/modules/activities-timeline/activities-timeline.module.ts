import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesTimelineComponent } from './activities-timeline.component';



@NgModule({
  declarations: [
    ActivitiesTimelineComponent
  ],
  exports: [
    ActivitiesTimelineComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ActivitiesTimelineModule { }
