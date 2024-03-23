import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantViewComponent } from './grant-view.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { ActivitiesTimelineModule } from './modules/activities-timeline/activities-timeline.module';
import { ProjectInformationModule } from './modules/project-information/project-information.module';
import { ReviewModule } from './modules/review/review.module';



@NgModule({
  declarations: [
    GrantViewComponent
  ],
  exports: [
    GrantViewComponent
  ],
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    AssessmentModule,
    ProjectInformationModule,
    ActivitiesTimelineModule,
    ReviewModule,
  ]
})
export class GrantViewModule { }
