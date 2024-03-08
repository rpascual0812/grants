import { AppReviewOtherInfoModalComponent } from './../../../modals/app-review-other-info-modal/app-review-other-info-modal.component';
import { Component, effect, inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppReviewOrgBankAccntInfoModalComponent } from '../../../modals/app-review-org-bank-accnt-info-modal/app-review-org-bank-accnt-info-modal.component';
import { AppReviewFiscalSponsorBankDetailModalComponent } from '../../../modals/app-review-fiscal-sponsor-bank-detail-modal/app-review-fiscal-sponsor-bank-detail-modal.component';
import { ApplicationReviewSignalService } from 'src/app/services/appliaction-review.signal.service';
import { ApplicationRead } from 'src/app/interfaces/application.interface';

@Component({
    selector: 'app-budget-review-finalization',
    templateUrl: './budget-review-finalization.component.html',
    styleUrls: ['./budget-review-finalization.component.scss'],
})
export class BudgetReviewFinalizationComponent {
    bsModalRef?: BsModalRef;
    applicationReviewSignalService = inject(ApplicationReviewSignalService);
    currentApplication: ApplicationRead | null = null;

    constructor(private modalService: BsModalService) {
        effect(() => {
            this.currentApplication = this.applicationReviewSignalService.applicationReview();
        });
    }

    handleShowModal(key: 'orgBankAccntInfo' | 'fiscalSponsorBankDetail' | 'otherInfo') {
        const initialState: any = this.currentApplication;
        switch (key) {
            case 'orgBankAccntInfo':
                this.bsModalRef = this.modalService.show(AppReviewOrgBankAccntInfoModalComponent, { initialState });
                break;
            case 'fiscalSponsorBankDetail':
                this.bsModalRef = this.modalService.show(AppReviewFiscalSponsorBankDetailModalComponent, {
                    initialState,
                });
                break;
            case 'otherInfo':
                this.bsModalRef = this.modalService.show(AppReviewOtherInfoModalComponent, { initialState });
                break;
        }
    }
}
