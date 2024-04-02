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

    constructor(
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService,

        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
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
        this.attachments = this.partner?.documents;
        this.form = this.formBuilder.group({
            partner_id: [partnerId],
            name: [this.partner?.name ?? '', Validators.required],
            address: [this.partner?.address ?? '', Validators.required],
            contact_number: [this.partner?.contact_number ?? '', Validators.required],
            email_address: [this.partner?.email_address ?? '', Validators.email],
            website: [this.partner?.website ?? ''],
            contact_person_name: [contact?.name ?? '', Validators.required],
            contact_person_number: [contact?.contact_number ?? '', Validators.required],
            contact_person_email_address: [contact?.email_address ?? '', [Validators.required, Validators.email]],
            documents: ['']
        });
    }

    handleClose() {
        this.bsModalRef.hide();
    }

    saveFormValue() {
        const { value } = this.form;

        this.applicationService
            .saveApplicationPartner({
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
                documents: value?.documents
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data as Partner;
                    if (status) {
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data,
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
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.attachments.push(res.file);
            this.form.get('documents')?.patchValue(this.attachments);
            this.cdr.detectChanges();
        });
    }
}
