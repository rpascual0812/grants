import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApplicationRead } from 'src/app/interfaces/application.interface';

@Component({
    selector: 'app-app-review-fiscal-sponsor-bank-detail-modal',
    templateUrl: './app-review-fiscal-sponsor-bank-detail-modal.component.html',
    styleUrls: ['./app-review-fiscal-sponsor-bank-detail-modal.component.scss'],
})
export class AppReviewFiscalSponsorBankDetailModalComponent {
    currentApplication: ApplicationRead | null = null

    constructor(public bsModalRef: BsModalRef, private modalService: BsModalService) {
        this.currentApplication = (modalService?.config?.initialState as ApplicationRead) ?? null
    }
}
