import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-app-review-fiscal-sponsor-bank-detail-modal',
    templateUrl: './app-review-fiscal-sponsor-bank-detail-modal.component.html',
    styleUrls: ['./app-review-fiscal-sponsor-bank-detail-modal.component.scss'],
})
export class AppReviewFiscalSponsorBankDetailModalComponent {
    constructor(public bsModalRef: BsModalRef) {}
}
