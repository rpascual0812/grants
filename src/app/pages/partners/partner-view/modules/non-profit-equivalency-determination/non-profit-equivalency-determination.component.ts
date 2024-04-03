import { ChangeDetectorRef, Component, OnInit, effect, inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';
import { PartnerEditModalComponent } from '../../../modals/partner-edit-modal/partner-edit-modal.component';
import { OnHiddenData } from '../../partner-view.component';
import * as _ from '../../../../../utilities/globals';
import { PartnerService } from 'src/app/services/partner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-non-profit-equivalency-determination',
    templateUrl: './non-profit-equivalency-determination.component.html',
    styleUrls: ['./non-profit-equivalency-determination.component.scss'],
})
export class NonProfitEquivalencyDeterminationComponent implements OnInit {
    bsModalRef?: BsModalRef;
    partner: PartnerForm | null = null;
    partnerSignalService = inject(PartnerSignalService);
    SERVER: string = _.BASE_URL;
    attachments: any = [];

    constructor(
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private partnerService: PartnerService,
        private toastr: ToastrService,
    ) { }

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

        const documents = this.partner?.documents ?? [];
        documents.forEach(doc => {
            if (doc.type == 'non_profit_equivalency_legal_registration') {
                this.attachments.push(doc);
            }
        });
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

    deleteAttachment(i: number, type: string) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this attachment?</strong>',
                icon: 'question',
                buttons: {
                    showClose: true,
                    showCancel: true,
                    focusConfirm: false,
                },
                confirmButtonText: '<i class="fa fa-trash"></i> Delete',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel',
            },
            () => {
                this.partnerService
                    .deleteAttachment(this.attachments[i].pk)
                    .subscribe({
                        next: (data: any) => {
                            this.attachments.splice(i, 1);
                        },
                        error: (error: any) => {
                            console.log(error);
                            this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                        },
                        complete: () => {
                            console.log('Complete');
                        }
                    });
            }
        );
    }
}
