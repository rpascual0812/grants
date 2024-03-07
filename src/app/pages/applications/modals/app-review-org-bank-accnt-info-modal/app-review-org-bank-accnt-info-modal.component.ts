import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-app-review-org-bank-accnt-info-modal',
    templateUrl: './app-review-org-bank-accnt-info-modal.component.html',
    styleUrls: ['./app-review-org-bank-accnt-info-modal.component.scss'],
})
export class AppReviewOrgBankAccntInfoModalComponent {
    constructor(public bsModalRef: BsModalRef) {}
}
