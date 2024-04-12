import { ChangeDetectorRef, Component, OnInit, effect, inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PartnerForm, PartnerSignalService } from 'src/app/services/partner.signal.service';
import { PartnerEditModalComponent } from '../../../modals/partner-edit-modal/partner-edit-modal.component';
import { OnHiddenData } from '../../partner-view.component';
import * as _ from '../../../../../utilities/globals';
import { DocumentService } from 'src/app/services/document.service';

@Component({
    selector: 'app-other-info',
    templateUrl: './other-info.component.html',
    styleUrls: ['./other-info.component.scss'],
})
export class OtherInfoComponent implements OnInit {
    bsModalRef?: BsModalRef;
    partner: PartnerForm | null = null;
    partnerSignalService = inject(PartnerSignalService);
    agreements: any = [];
    financial_statements: any = [];

    SERVER: string = _.BASE_URL;

    constructor(
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private documentService: DocumentService,
        private cdr: ChangeDetectorRef,
    ) { }

    partnerSignalEffect = effect(
        () => {
            const section = this.partnerSignalService?.editSectionKey();
            if (section === 'otherInfo') {
                this.handleModal();
            }
        },
        {
            allowSignalWrites: true,
        }
    );

    ngOnInit() {
        this.partner = this.partnerSignalService.partnerForm();
        this.agreements = this.partner?.partner_fiscal_sponsor?.documents;
        this.financial_statements = this.partner?.organization?.partner_organization_other_information?.documents;
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

    typeOf(value?: boolean) {
        return typeof value
    }

    deleteAgreement(index: number) {
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
                this.documentService.destroy(this.agreements[index].pk).subscribe({
                    next: (data: any) => {
                        if (data.status) {
                            const toBeRemoved = this.agreements.at(index);
                            this.agreements.splice(index, 1);
                            this.removeDocument(toBeRemoved);
                            this.cdr.detectChanges();
                        }
                    },
                    error: (error: any) => {
                        console.log(error);
                    },
                    complete: () => {
                        console.log('Complete');
                    },
                });
            }
        );
    }

    deleteFinancialStatement(index: number) {
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
                this.documentService.destroy(this.financial_statements[index].pk).subscribe({
                    next: (data: any) => {
                        if (data.status) {
                            const toBeRemoved = this.financial_statements.at(index);
                            this.financial_statements.splice(index, 1);
                            this.removeDocument(toBeRemoved);
                            this.cdr.detectChanges();
                        }
                    },
                    error: (error: any) => {
                        console.log(error);
                    },
                    complete: () => {
                        console.log('Complete');
                    },
                });
            }
        );
    }

    removeDocument(documentToBeRemoved: Partial<Document>) {
        const partner = this.partner;
        const documents = partner?.partner_fiscal_sponsor?.documents;
        // const uniqDocuments = documents?.filter((document) => document?.pk !== documentToBeRemoved?.pk);
        // this.applicationSignalService.appForm.set({
        //     ...currentApplication,
        //     partner: {
        //         ...currentApplication?.partner,
        //     },
        // });
    }
}
