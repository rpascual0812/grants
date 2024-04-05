import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PartnerAssessment } from 'src/app/interfaces/_application.interface';
import { PartnerForm } from 'src/app/services/partner.signal.service';

const MODAL_TITLE_MAPPER = {
    partnerInformation: `Partner's Information`,
    organizationProfile: `Organization Profile`,
    nonProfitEquivalencyDetermination: `Non Profit Equivalency Determination`,
    otherInfo: `Other Information`,
    assessment: `Assessment`
};
@Component({
    selector: 'app-partner-edit-modal',
    templateUrl: './partner-edit-modal.component.html',
    styleUrls: ['./partner-edit-modal.component.scss'],
})
export class PartnerEditModalComponent {
    section: null | string = null;
    partner: PartnerForm | null = null;
    partnerAssessment: PartnerAssessment | null = null;
    modalTitle = '';

    constructor(public bsModalRef: BsModalRef, private modalService: BsModalService) {
        const section = (modalService?.config?.initialState as any)?.section;
        const partner = (modalService?.config?.initialState as any)?.partner;
        const partnerAssessment = (modalService?.config?.initialState as any)?.partnerAssessment;
        this.section = section;
        this.partner = partner;
        this.partnerAssessment = partnerAssessment;
        this.modalTitle = MODAL_TITLE_MAPPER[section as keyof typeof MODAL_TITLE_MAPPER];
    }
}
