import { ChangeDetectorRef, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import * as _ from '../../../../utilities/globals';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { DocumentService } from 'src/app/services/document.service';
import { Document, PartnerFiscalSponsor } from 'src/app/interfaces/_application.interface';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

@Component({
    selector: 'app-app-review-fiscal-sponsor-bank-detail-modal',
    templateUrl: './app-review-fiscal-sponsor-bank-detail-modal.component.html',
    styleUrls: ['./app-review-fiscal-sponsor-bank-detail-modal.component.scss'],
})
export class AppReviewFiscalSponsorBankDetailModalComponent {
    currentApplication: Application | null = null

    @Output() callback = new EventEmitter<any>();

    filters: any = {};
    form: FormGroup;
    fiscal_sponsor: PartnerFiscalSponsor | undefined = undefined;

    loading: boolean = false;
    submitted: boolean = false;
    isHidden: string = 'no';

    attachments: any = [];
    SERVER: string = _.BASE_URL;

    applicationSignalService = inject(ApplicationSignalService);

    constructor(
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private documentService: DocumentService
    ) {
        this.currentApplication = (modalService?.config?.initialState as Application) ?? null
    }

    ngOnInit(): void {
        this.attachments = this.currentApplication?.partner?.partner_fiscal_sponsor?.documents;
        this.setForm();
    }

    setForm() {
        this.fiscal_sponsor = this.currentApplication?.partner?.partner_fiscal_sponsor;
        console.log(this.fiscal_sponsor);
        this.form = this.formBuilder.group({
            pk: [this.fiscal_sponsor?.pk ?? ''],
            partner_pk: [this.currentApplication?.partner?.pk ?? ''],
            name: [this.fiscal_sponsor?.name ?? '', Validators.required],
            address: [this.fiscal_sponsor?.address ?? '', Validators.required],
            head: [this.fiscal_sponsor?.head ?? '', Validators.required],
            person_in_charge: [this.fiscal_sponsor?.person_in_charge ?? '', Validators.required],
            contact_number: [this.fiscal_sponsor?.contact_number ?? '', Validators.required],
            email_address: [this.fiscal_sponsor?.email_address ?? '', Validators.required],
            bank_account_name: [this.fiscal_sponsor?.bank_account_name ?? '', Validators.required],
            account_number: [this.fiscal_sponsor?.account_number ?? '', Validators.required],
            bank_name: [this.fiscal_sponsor?.bank_name ?? '', Validators.required],
            bank_branch: [this.fiscal_sponsor?.bank_branch ?? '', Validators.required],
            bank_address: [this.fiscal_sponsor?.bank_address ?? '', Validators.required],
            swift_code: [this.fiscal_sponsor?.swift_code ?? '', Validators.required],
            documents: ['']
        });
    }

    get f() { return this.form.controls; }

    submit() {
        this.loading = true;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.form.get('pk')?.patchValue(this.fiscal_sponsor?.pk);

        const fiscalSponsor = {
            partner_pk: this.currentApplication?.partner?.pk,
            pk: this.fiscal_sponsor?.pk,
            ...this.form.value,
        }

        this.applicationService
            .saveApplicationFiscalSponsor(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.callback.emit({ ...fiscalSponsor });
                    this.toastr.success('The Fiscal Sponsor Bank Details has been successfully ' + (this.fiscal_sponsor?.pk ? 'updated' : 'added'), 'SUCCESS!');
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while updating the Fiscal Sponsor Bank Details. Please try again', 'ERROR!');
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                    this.bsModalRef.hide();
                }
            });
    }

    uploadFiles() {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.attachments.push(res.file);
            this.form.get('documents')?.patchValue(this.attachments);
            this.cdr.detectChanges();
        });
    }

    deleteAttachment(index: number) {
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
                this.documentService.destroy(this.attachments[index].pk).subscribe({
                    next: (data: any) => {
                        if (data.status) {
                            const toBeRemoved = this.attachments.at(index);
                            this.attachments.splice(index, 1);
                            this.removeDocument(toBeRemoved);
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

    removeDocument(documentToBeRemoved: Partial<Document>) {
        const currentApplication = this.currentApplication;
        const documents = currentApplication?.partner?.partner_fiscal_sponsor?.documents;
        const uniqDocuments = documents?.filter((document) => document?.pk !== documentToBeRemoved?.pk);
        this.applicationSignalService.appForm.set({
            ...currentApplication,
            partner: {
                ...currentApplication?.partner,
            },
        });
    }
}
