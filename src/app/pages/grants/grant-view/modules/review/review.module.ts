import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InitialSubmissionModule } from './modules/initial-submission/initial-submission.module';
import { ContractPreparationModule } from './modules/contract-preparation/contract-preparation.module';
import { FinalApprovalModule } from './modules/final-approval/final-approval.module';
import { PartnerSigningModule } from './modules/partner-signing/partner-signing.module';
import { CompletedModule } from './modules/completed/completed.module';
import { FundReleaseModule } from './modules/fund-release/fund-release.module';
import { GrantsTeamReviewModule } from 'src/app/pages/applications/application-review/modules/grants-team-review/grants-team-review.module';
import { AdvisersReviewModule } from 'src/app/pages/applications/application-review/modules/advisers-review/advisers-review.module';
import { BudgetReviewFinalizationModule } from 'src/app/pages/applications/application-review/modules/budget-review-finalization/budget-review-finalization.module';
import { FinancialManagementCapacityModule } from 'src/app/pages/applications/application-review/modules/financial-management-capacity/financial-management-capacity.module';
import { DueDiligenceFinalReviewModule } from 'src/app/pages/applications/application-review/modules/due-diligence-final-review/due-diligence-final-review.module';

@NgModule({
    declarations: [
        ReviewComponent
    ],
    exports: [
        ReviewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        InitialSubmissionModule,
        ContractPreparationModule,
        FinalApprovalModule,
        PartnerSigningModule,
        FundReleaseModule,
        CompletedModule,

        GrantsTeamReviewModule,
        AdvisersReviewModule,
        BudgetReviewFinalizationModule,
        FinancialManagementCapacityModule,
        DueDiligenceFinalReviewModule
    ]
})
export class ReviewModule { }
