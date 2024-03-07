import { AppReviewOtherInfoModalComponent } from './../../../modals/app-review-other-info-modal/app-review-other-info-modal.component';
import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppReviewOrgBankAccntInfoModalComponent } from '../../../modals/app-review-org-bank-accnt-info-modal/app-review-org-bank-accnt-info-modal.component';
import { AppReviewFiscalSponsorBankDetailModalComponent } from '../../../modals/app-review-fiscal-sponsor-bank-detail-modal/app-review-fiscal-sponsor-bank-detail-modal.component';

@Component({
    selector: 'app-budget-review-finalization',
    templateUrl: './budget-review-finalization.component.html',
    styleUrls: ['./budget-review-finalization.component.scss'],
})
export class BudgetReviewFinalizationComponent {
    bsModalRef?: BsModalRef;

    constructor(private modalService: BsModalService) {}

    handleShowModal(key: 'orgBankAccntInfo' | 'fiscalSponsorBankDetail' | 'otherInfo') {
        switch (key) {
            case 'orgBankAccntInfo':
                this.bsModalRef = this.modalService.show(AppReviewOrgBankAccntInfoModalComponent);
                break;
            case 'fiscalSponsorBankDetail':
                this.bsModalRef = this.modalService.show(AppReviewFiscalSponsorBankDetailModalComponent);
                break;
            case 'otherInfo':
                this.bsModalRef = this.modalService.show(AppReviewOtherInfoModalComponent);
                break;
        }
    }
}
