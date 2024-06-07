import { AppReviewOtherInfoModalComponent } from './../../../modals/app-review-other-info-modal/app-review-other-info-modal.component';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, effect, inject } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { AppReviewOrgBankAccntInfoModalComponent } from '../../../modals/app-review-org-bank-accnt-info-modal/app-review-org-bank-accnt-info-modal.component';
import { AppReviewFiscalSponsorBankDetailModalComponent } from '../../../modals/app-review-fiscal-sponsor-bank-detail-modal/app-review-fiscal-sponsor-bank-detail-modal.component';
import { ApplicationReviewSignalService } from 'src/app/services/appliaction-review.signal.service';
import { Application, Document } from 'src/app/interfaces/_application.interface';
import { DateTime } from 'luxon';
import { UserService } from 'src/app/services/user.service';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { ApplicationService } from 'src/app/services/application.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as _ from '../../../../../utilities/globals';
import { UserSignalService } from 'src/app/services/user.signal.service';
import { DocumentService } from 'src/app/services/document.service';

type Attachments = {
    original_budget_proposal: Document[];
    revised_budget_proposal: Document[];
    approved_budget_proposal: Document[];
};

type AttachmentKey = keyof Attachments;

@Component({
    selector: 'app-budget-review-finalization',
    templateUrl: './budget-review-finalization.component.html',
    styleUrls: ['./budget-review-finalization.component.scss'],
})
export class BudgetReviewFinalizationComponent implements OnInit {
    bsModalRef?: BsModalRef;
    applicationReviewSignalService = inject(ApplicationReviewSignalService);
    @Input() currentApplication: Application | null;
    @Output() recommendationSaved = new EventEmitter<boolean>();

    dateNow = DateTime.now().toFormat('LLLL dd, yyyy');
    user: any = {};

    recommendation: any = '';

    attachments: Attachments = {
        original_budget_proposal: [],
        revised_budget_proposal: [],
        approved_budget_proposal: [],
    };

    SERVER: string = _.BASE_URL;

    userSignalService = inject(UserSignalService);

    restrictions: any = _.RESTRICTIONS;
    permission = _.PERMISSIONS;

    constructor(
        public documentUploaderRef: BsModalRef,
        private modalService: BsModalService,
        private userService: UserService,
        private cdr: ChangeDetectorRef,
        private applicationService: ApplicationService,
        private documentService: DocumentService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        setTimeout(() => {
            this.user = this.userSignalService.user();

            this.user?.user_role?.forEach((user_role: any) => {
                this.permission.grant_application =
                    this.restrictions[user_role.role.restrictions.grant_application] >
                    this.restrictions[this.permission.grant_application]
                        ? user_role.role.restrictions.grant_application
                        : this.permission.grant_application;
            });
            this.cdr.detectChanges();
        }, 1000);

        if (this.currentApplication?.documents) {
            this.currentApplication?.documents.forEach((doc) => {
                const docType = (doc?.type as AttachmentKey) ?? '';
                if (this.attachments?.[docType]) {
                    this.attachments[docType].push(doc);
                }
            });
        }
    }

    handleShowModal(key: 'orgBankAccntInfo' | 'fiscalSponsorBankDetail' | 'otherInfo', action: string) {
        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                currentApplication: this.currentApplication,
                action: action,
            },
        };

        switch (key) {
            case 'orgBankAccntInfo':
                this.bsModalRef = this.modalService.show(AppReviewOrgBankAccntInfoModalComponent, initialState);
                this.bsModalRef.content.callback.subscribe((res: any) => {
                    this.currentApplication = {
                        ...this.currentApplication,
                        partner: {
                            ...this.currentApplication?.partner,
                            organization: {
                                ...this.currentApplication?.partner?.organization,
                                partner_organization_bank: {
                                    ...res,
                                },
                            },
                        },
                    };
                    this.cdr.detectChanges();
                });
                break;
            case 'fiscalSponsorBankDetail':
                this.bsModalRef = this.modalService.show(AppReviewFiscalSponsorBankDetailModalComponent, initialState);
                this.bsModalRef.content.callback.subscribe((res: any) => {
                    this.currentApplication = {
                        ...this.currentApplication,
                        partner: {
                            ...this.currentApplication?.partner,
                            partner_fiscal_sponsor: {
                                ...res,
                            },
                        },
                    };

                    this.cdr.detectChanges();
                });
                break;
            case 'otherInfo':
                this.bsModalRef = this.modalService.show(AppReviewOtherInfoModalComponent, initialState);
                this.bsModalRef.content.callback.subscribe((res: any) => {
                    this.currentApplication = {
                        ...this.currentApplication,
                        partner: {
                            ...this.currentApplication?.partner,
                            organization: {
                                ...this.currentApplication?.partner?.organization,
                                partner_organization_other_information: {
                                    ...res,
                                },
                            },
                        },
                    };

                    this.cdr.detectChanges();
                });
                break;
        }
    }

    uploadFiles(type: AttachmentKey) {
        const initialState: ModalOptions = {
            class: 'modal-lg',
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            const data = {
                application_pk: this.currentApplication?.pk,
                type: type,
                file: res.file,
            };
            this.applicationService.saveApplicationAttachment(data).subscribe({
                next: (data: any) => {
                    this.attachments[type].push(res.file);
                },
                error: (err: HttpErrorResponse) => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(`Error trying to remove application. ${statusCode} ${errorMessage} `);
                },
            });

            this.cdr.detectChanges();
        });
    }

    recommendationOnChange(ev: any) {
        const recommendation = {
            application_pk: this.currentApplication?.pk,
            recommendation: ev,
            type: 'advisers_review',
        };

        this.applicationService.updateRecommendation(recommendation).subscribe({
            next: (data: any) => {
                this.toastr.success(`Your recommendation has been successfully saved.`);
                this.recommendationSaved.emit(true);
            },
            error: (err: HttpErrorResponse) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(`Error trying to remove application. ${statusCode} ${errorMessage} `);
            },
        });
    }

    delete(index: number, key: AttachmentKey) {
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
                this.documentService.destroy(this.attachments[key]?.at(index)?.pk).subscribe({
                    next: (data: any) => {
                        if (data.status) {
                            const toBeRemoved = this.attachments[key]?.at(index);
                            this.attachments[key] = this.attachments[key]?.filter(
                                (attachment) => attachment?.pk !== toBeRemoved?.pk
                            );
                            this.cdr.detectChanges();
                        }
                    },
                    error: (error: any) => {
                        console.log(error);
                        this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                    },
                    complete: () => {
                        console.log('Complete');
                    },
                });
            }
        );
    }
}
