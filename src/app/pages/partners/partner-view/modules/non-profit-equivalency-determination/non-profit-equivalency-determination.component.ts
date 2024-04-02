import { ChangeDetectorRef, Component, OnInit, effect, inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';
import { PartnerEditModalComponent } from '../../../modals/partner-edit-modal/partner-edit-modal.component';
import { OnHiddenData } from '../../partner-view.component';

@Component({
    selector: 'app-non-profit-equivalency-determination',
    templateUrl: './non-profit-equivalency-determination.component.html',
    styleUrls: ['./non-profit-equivalency-determination.component.scss'],
})
export class NonProfitEquivalencyDeterminationComponent implements OnInit {
    bsModalRef?: BsModalRef;
    partner: PartnerForm | null = null;
    partnerSignalService = inject(PartnerSignalService);

    constructor(private modalService: BsModalService, private changeDetection: ChangeDetectorRef) {}

    partnerSignalEffect = effect(
        () => {
            const section = this.partnerSignalService?.editSectionKey();
            if (section === 'nonProfitEquivalencyDetermination') {
                this.handleModal();
            }
        },
        {
            allowSignalWrites: true,
        }
    );

    ngOnInit() {
        this.partner = this.partnerSignalService.partnerForm();
    }

    parseOtherCurrency(currencyOther: string) {
        return getOtherCurrencyKey(currencyOther);
    }

    handleModal() {
        const section = this.partnerSignalService?.editSectionKey();
        this.bsModalRef = this.modalService.show(PartnerEditModalComponent, {
            class: 'modal-lg',
            initialState: {
                partner: this.partner,
                section,
            },
        });
        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: OnHiddenData) => {
            if (this.partner && isSaved) {
                this.partner = data;
                this.changeDetection.detectChanges();
            }
        });
        this.partnerSignalService.editSectionKey.set(null);
    }
}
