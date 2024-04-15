import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantViewComponent } from './grant-view.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { ActivitiesTimelineModule } from './modules/activities-timeline/activities-timeline.module';
import { ProjectInformationModule } from './modules/project-information/project-information.module';
import { ReviewModule } from './modules/review/review.module';
import { GrantTabLayoutModule } from './modules/grant-tab-layout/grant-tab-layout.module';
import { FundingReleaseComponent } from './modules/grant-tab-views/funding-release/funding-release.component';
import { GoalsComponent } from './modules/grant-tab-views/goals/goals.component';
import { BeneficiariesComponent } from './modules/grant-tab-views/beneficiaries/beneficiaries.component';
import { AttendeesComponent } from './modules/grant-tab-views/attendees/attendees.component';


@NgModule({
  declarations: [
    GrantViewComponent,
    FundingReleaseComponent,
    GoalsComponent,
    BeneficiariesComponent,
    AttendeesComponent
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
    GrantTabLayoutModule,
  ]
})
export class GrantViewModule { }
