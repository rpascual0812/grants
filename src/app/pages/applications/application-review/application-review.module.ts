import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationReviewComponent } from './application-review.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { MediumGrantsModule } from './modules/medium-grants/medium-grants.module';
import { GrantsTeamReviewModule } from './modules/grants-team-review/grants-team-review.module';
import { AdvisersReviewModule } from './modules/advisers-review/advisers-review.module';
import { BudgetReviewFinalizationModule } from './modules/budget-review-finalization/budget-review-finalization.module';
import { DueDiligenceFinalReviewModule } from './modules/due-diligence-final-review/due-diligence-final-review.module';



@NgModule({
    declarations: [
        ApplicationReviewComponent
    ],
    imports: [
        CommonModule,
        SelectModule,
        MediumGrantsModule,
        GrantsTeamReviewModule,
        AdvisersReviewModule,
        BudgetReviewFinalizationModule,
        DueDiligenceFinalReviewModule
    ]
})
export class ApplicationReviewModule { }
