import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantProgressComponent } from './grant-progress.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { GrantInformationComponent } from './grant-information/grant-information.component';
import { TrancheReleasesComponent } from './tranche-releases/tranche-releases.component';
import { FormsModule } from '@angular/forms';
import { GrantReportsComponent } from './grant-reports/grant-reports.component';
import { GrantAssessmentComponent } from './grant-assessment/grant-assessment.component';


@NgModule({
    declarations: [
        GrantProgressComponent,
        GrantInformationComponent,
        TrancheReleasesComponent,
        GrantReportsComponent,
        GrantAssessmentComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        AccordionModule
    ],
    exports: [GrantProgressComponent]
})
export class GrantProgressModule { }
