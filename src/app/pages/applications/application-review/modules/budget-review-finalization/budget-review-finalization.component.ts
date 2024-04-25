import { AppReviewOtherInfoModalComponent } from './../../../modals/app-review-other-info-modal/app-review-other-info-modal.component';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, effect, inject } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { AppReviewOrgBankAccntInfoModalComponent } from '../../../modals/app-review-org-bank-accnt-info-modal/app-review-org-bank-accnt-info-modal.component';
import { AppReviewFiscalSponsorBankDetailModalComponent } from '../../../modals/app-review-fiscal-sponsor-bank-detail-modal/app-review-fiscal-sponsor-bank-detail-modal.component';
import { ApplicationReviewSignalService } from 'src/app/services/appliaction-review.signal.service';
import { Application } from 'src/app/interfaces/_application.interface';
import { DateTime } from 'luxon';
import { UserService } from 'src/app/services/user.service';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { ApplicationService } from 'src/app/services/application.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as _ from '../../../../../utilities/globals';

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

    attachments: any = {
        original_budget_proposal: [],
        revised_budget_proposal: [],
        approved_budget_proposal: []
    };

    SERVER: string = _.BASE_URL;

    constructor(
        public documentUploaderRef: BsModalRef,
        private modalService: BsModalService,
        private userService: UserService,
        private cdr: ChangeDetectorRef,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
    ) { }

    ngOnInit() {
        this.fetchUser();

        if (this.currentApplication?.documents) {
            this.currentApplication?.documents.forEach(doc => {
                if (this.attachments[doc?.type ?? '']) {
                    this.attachments[doc?.type ?? ''].push(doc);
                }
            });
        }
    }

    fetchUser() {
        this.userService.fetch()
            .subscribe({
                next: (data: any) => {
                    this.user = data;
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }

    handleShowModal(key: 'orgBankAccntInfo' | 'fiscalSponsorBankDetail' | 'otherInfo') {
        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                currentApplication: this.currentApplication
            }
        };

        switch (key) {
            case 'orgBankAccntInfo':
                this.bsModalRef = this.modalService.show(AppReviewOrgBankAccntInfoModalComponent, initialState);
                this.bsModalRef.content.callback.subscribe((res: any) => {
                    // this.currentApplication?.partner?.organization?.partner_organization_bank = res;
                    this.currentApplication = {
                        ...this.currentApplication,
                        partner: {
                            ...this.currentApplication?.partner,
                            organization: {
                                ...this.currentApplication?.partner?.organization,
                                partner_organization_bank: {
                                    ...res
                                }
                            }
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
                                ...res
                            }
                        },
                    };

                    this.cdr.detectChanges();
                });
                break;
            case 'otherInfo':
                this.bsModalRef = this.modalService.show(AppReviewOtherInfoModalComponent, initialState);
                this.bsModalRef.content.callback.subscribe((res: any) => {
                    // this.currentApplication?.partner?.organization?.partner_organization_other_information = res;
                    this.currentApplication = {
                        ...this.currentApplication,
                        partner: {
                            ...this.currentApplication?.partner,
                            organization: {
                                ...this.currentApplication?.partner?.organization,
                                partner_organization_other_information: {
                                    ...res
                                }
                            }
                        },
                    };

                    this.cdr.detectChanges();
                });
                break;
        }
    }

    uploadFiles(type: string) {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            const data = {
                application_pk: this.currentApplication?.pk,
                type: type,
                file: res.file
            }
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
            type: 'advisers_review'
        }

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
}
