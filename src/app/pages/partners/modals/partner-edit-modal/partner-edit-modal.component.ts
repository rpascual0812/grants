import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PartnerForm } from 'src/app/services/partner.signal.service';

const MODAL_TITLE_MAPPER = {
    partnerInformation: `Partner's Information`,
    organizationProfile: `Organization Profile`,
    nonProfitEquivalencyDetermination: `Non Profit Equivalency Determination`,
    otherInfo: `Other Information`,
};
@Component({
    selector: 'app-partner-edit-modal',
    templateUrl: './partner-edit-modal.component.html',
    styleUrls: ['./partner-edit-modal.component.scss'],
})
export class PartnerEditModalComponent {
    section: null | string = null;
    partner: PartnerForm | null = null;
    modalTitle = ''

    constructor(public bsModalRef: BsModalRef, private modalService: BsModalService) {
        const section = (modalService?.config?.initialState as any)?.section;
        const partner = (modalService?.config?.initialState as any)?.partner;
        this.section = section;
        this.partner = partner;
        this.modalTitle = MODAL_TITLE_MAPPER[section as keyof typeof MODAL_TITLE_MAPPER]
    }
}
