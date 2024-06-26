import { AppReviewOtherInfoModalComponent } from './../../../modals/app-review-other-info-modal/app-review-other-info-modal.component';
import { AppReviewFiscalSponsorBankDetailModalComponent } from './../../../modals/app-review-fiscal-sponsor-bank-detail-modal/app-review-fiscal-sponsor-bank-detail-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetReviewFinalizationComponent } from './budget-review-finalization.component';
import { AppReviewOrgBankAccntInfoModalComponent } from '../../../modals/app-review-org-bank-accnt-info-modal/app-review-org-bank-accnt-info-modal.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        BudgetReviewFinalizationComponent,
        AppReviewOrgBankAccntInfoModalComponent,
        AppReviewFiscalSponsorBankDetailModalComponent,
        AppReviewOtherInfoModalComponent,
    ],
    exports: [BudgetReviewFinalizationComponent],
    imports: [
        CommonModule,
        NgSelectModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class BudgetReviewFinalizationModule { }
