import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantViewComponent } from './grant-view.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
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
import { OutputsComponent } from './modules/grant-tab-views/outputs/outputs.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { CapdevComponent } from './modules/grant-tab-views/capdev/capdev.component';
import { DocumentationsComponent } from './modules/grant-tab-views/documentations/documentations.component';
import { LessonsComponent } from './modules/grant-tab-views/lessons/lessons.component';
import { ProjectEditModalComponent } from './modals/project-edit-modal/project-edit-modal.component';
import { ProjInfoViewComponent } from './modals/modal-views/proj-info-view/proj-info-view.component';
import { AssessmentViewComponent } from './modals/modal-views/assessment-view/assessment-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivitiesAndTimelineViewComponent } from './modals/modal-views/activities-and-timeline-view/activities-and-timeline-view.component';
import { InputDropdownModule } from '../../applications/application-new/modules/input-dropdown/input-dropdown.module';
import { FundingReleaseTrancheModalComponent } from './modals/funding-release-tranche-modal/funding-release-tranche-modal.component';
import { FundingReleaseLiquidationModalComponent } from './modals/funding-release-liquidation-modal/funding-release-liquidation-modal.component';
import { EditDeadlineModalComponent } from './modals/edit-deadline-modal/edit-deadline-modal.component';
import { AttendeesModalComponent } from './modules/grant-tab-views/attendees/attendees-modal/attendees-modal.component';
import { ProjectBeneficiaryModalComponent } from './modals/project-beneficiary-modal/project-beneficiary-modal.component';
import { DocumentationModalComponent } from './modules/grant-tab-views/documentations/documentation-modal/documentation-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PhotosComponent } from './modules/grant-tab-views/documentations/modules/photos/photos.component';
import { VideosComponent } from './modules/grant-tab-views/documentations/modules/videos/videos.component';
import { DocumentsComponent } from './modules/grant-tab-views/documentations/modules/documents/documents.component';
import { LinksComponent } from './modules/grant-tab-views/documentations/modules/links/links.component';
import { EventModalComponent } from './modules/grant-tab-views/attendees/event-modal/event-modal.component';

@NgModule({
    declarations: [
        GrantViewComponent,
        FundingReleaseComponent,
        GoalsComponent,
        BeneficiariesComponent,
        AttendeesComponent,
        OutputsComponent,
        CapdevComponent,
        DocumentationsComponent,
        LessonsComponent,
        ProjectEditModalComponent,
        ProjInfoViewComponent,
        AssessmentViewComponent,
        ActivitiesAndTimelineViewComponent,
        FundingReleaseTrancheModalComponent,
        FundingReleaseLiquidationModalComponent,
        EditDeadlineModalComponent,
        AttendeesModalComponent,
        ProjectBeneficiaryModalComponent,
        DocumentationModalComponent,
        PhotosComponent,
        VideosComponent,
        DocumentsComponent,
        LinksComponent,
        EventModalComponent,
    ],
    exports: [
        GrantViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AccordionModule.forRoot(),
        AssessmentModule,
        ProjectInformationModule,
        ActivitiesTimelineModule,
        ReviewModule,
        GrantTabLayoutModule,
        SelectModule,
        InputDropdownModule,
        BsDatepickerModule.forRoot(),
        NgxPaginationModule,
    ]
})
export class GrantViewModule { }
