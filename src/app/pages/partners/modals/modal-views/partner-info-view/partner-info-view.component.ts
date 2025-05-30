import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Partner } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { PartnerForm } from 'src/app/services/partner.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { OnHiddenData } from '../../../partner-view/partner-view.component';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import * as _ from '../../../../../utilities/globals';
import { DocumentService } from 'src/app/services/document.service';

@Component({
    selector: 'app-partner-info-view',
    templateUrl: './partner-info-view.component.html',
    styleUrls: ['./partner-info-view.component.scss'],
})
export class PartnerInfoViewComponent implements OnInit {
    @Input() partner: PartnerForm | null = null;
    processing = false;
    submitted = false;
    form: FormGroup;

    attachments: any = [];
    SERVER: string = _.BASE_URL;

    constructor(
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private documentService: DocumentService
    ) { }

    ngOnInit() {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const contact = this.partner?.contacts?.at(0);
        const partnerId = this.partner?.partner_id;
        const partnerPk = this.partner?.pk;
        this.attachments = [...(this.partner?.documents ?? [])];
        this.form = this.formBuilder.group({
            pk: [partnerPk],
            partner_id: [partnerId],
            name: [this.partner?.name ?? '', Validators.required],
            address: [this.partner?.address ?? '', Validators.required],
            contact_number: [this.partner?.contact_number ?? '', Validators.required],
            email_address: [this.partner?.email_address ?? '', Validators.email],
            website: [this.partner?.website ?? ''],
            contact_person_name: [contact?.name ?? '', Validators.required],
            contact_person_number: [contact?.contact_number ?? '', Validators.required],
            contact_person_email_address: [contact?.email_address ?? '', [Validators.required, Validators.email]],
            documents: [''],
        });
    }

    handleClose() {
        this.bsModalRef.hide();
    }

    getFormValue() {
        const { value } = this.form;
        return {
            pk: value.pk,
            partner_id: value.partner_id,
            name: value.name,
            address: value.address,
            contact_number: value.contact_number,
            website: value.website,
            email_address: value?.email_address,
            contacts: [
                {
                    name: value.contact_person_name,
                    contact_number: value.contact_person_number,
                    email_address: value.contact_person_email_address,
                },
            ],
            documents: this.attachments,
        };
    }

    saveFormValue() {
        const formValue = this.getFormValue();
        this.applicationService
            .saveApplicationPartner({
                ...formValue,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data as Partner;
                    if (status) {
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                ...data,
                                documents: this.attachments,
                            },
                        } as OnHiddenData);
                        this.bsModalRef.hide();
                        this.toastr.success(`Partner's Information has been successfully saved`, 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Partner's Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Partner's Information. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    handleSave() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
        }
    }

    uploadFiles() {
        const initialState: ModalOptions = {
            class: 'modal-lg',
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
                this.documentService.destroy(this.attachments?.at(index)?.pk).subscribe({
                    next: (data: any) => {
                        if (data.status) {
                            if (this.partner?.documents) {
                                this.attachments =
                                    this.attachments?.filter((_item: unknown, idx: number) => idx !== index) ?? [];
                            }
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
