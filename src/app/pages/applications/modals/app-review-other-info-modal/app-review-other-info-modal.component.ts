import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Application, Document, FinancialHumanResources, PartnerOrganizationOtherInformation } from 'src/app/interfaces/_application.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { ApplicationService } from 'src/app/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from 'src/app/services/document.service';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import * as _ from '../../../../utilities/globals';

@Component({
    selector: 'app-app-review-other-info-modal',
    templateUrl: './app-review-other-info-modal.component.html',
    styleUrls: ['./app-review-other-info-modal.component.scss'],
})
export class AppReviewOtherInfoModalComponent implements OnInit {
    currentApplication: Application | null = null;
    @Output() callback = new EventEmitter<any>();

    form: FormGroup;
    otherInformation: PartnerOrganizationOtherInformation | undefined = undefined;

    loading: boolean = false;
    submitted: boolean = false;

    attachments: any = [];
    SERVER: string = _.BASE_URL;
    humanResources: any = [];
    selectedDesignation = 'Finance Officer';

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
    ) { }

    ngOnInit(): void {
        this.attachments = this.currentApplication?.partner?.organization?.partner_organization_other_information?.documents;
        this.setForm();
    }

    setForm() {
        this.otherInformation = this.currentApplication?.partner?.organization?.partner_organization_other_information;
        this.humanResources = this.otherInformation?.organization_other_information_financial_human_resources;

        this.form = this.formBuilder.group({
            has_project: [this.otherInformation?.has_project ?? false],
            has_financial_policy: [this.otherInformation?.has_financial_policy ?? false],
            has_financial_policy_no_reason: [this.otherInformation?.has_financial_policy_no_reason ?? ''],
            has_financial_system: [this.otherInformation?.has_financial_system ?? false],
            has_financial_system_no_reason: [this.otherInformation?.has_financial_system_no_reason ?? ''],
            audit_financial_available: [this.otherInformation?.audit_financial_available ?? false],
            has_reviewed_financial_system: [this.otherInformation?.has_reviewed_financial_system ?? false],
            recommendation: [this.otherInformation?.recommendation ?? ''],
            documents: [''],
            human_resources: ['']
        });
        this.initialPartnerOrgOtherInfo();
    }

    get f() {
        return this.form.controls;
    }

    initialPartnerOrgOtherInfo(partnerOrgOtherInfo?: PartnerOrganizationOtherInformation) {
        const fields = ['has_financial_policy', 'has_financial_system'];
        fields.forEach((field) => {
            const value = partnerOrgOtherInfo?.[field as keyof typeof partnerOrgOtherInfo] ?? false ? 'true' : 'false';
            this.configureDescription(field, value);
        });
    }

    configureDescription(key: string, value: string) {
        if (['has_financial_policy', 'has_financial_system'].includes(key)) {
            if (value === 'true') {
                this.form.controls?.[`${key}_no_reason`]?.setValue('');
                this.onRemoveDescriptionValidations(`${key}_no_reason`);
            }
            if (value === 'false') {
                this.onAddDescriptionValidations(`${key}_no_reason`);
            }
        }
    }

    onAddDescriptionValidations(key: string) {
        this.form?.controls?.[key]?.addValidators(Validators.required);
        this.form?.controls?.[key]?.updateValueAndValidity();
    }

    onRemoveDescriptionValidations(key: string) {
        this.form?.controls?.[key]?.setErrors(null);
        this.form?.controls?.[key]?.clearValidators();
        this.form?.controls?.[key]?.updateValueAndValidity();
    }

    onChangeSelectedBoolOpt(value: string, key: string) {
        this.form.controls[key]?.setValue(value === 'true' ? true : false);
        this.configureDescription(key, value);
    }

    submit() {
        console.log('humanResources', this.humanResources);
        this.loading = true;
        this.submitted = true;
        this.form.get('human_resources')?.patchValue(this.humanResources);

        const { invalid, value } = this.form;

        if (invalid) {
            return;
        }

        this.applicationService
            .savePartnerOtherInfo({
                partner_organization_pk: this.currentApplication?.partner?.organization?.pk,
                pk: this.otherInformation?.pk,
                ...value,
            })
            .subscribe({
                next: (data: any) => {
                    this.callback.emit({ ...this.otherInformation });
                    this.toastr.success(
                        'The Other Information has been successfully ' +
                        (this.otherInformation?.pk ? 'updated' : 'added'),
                        'SUCCESS!'
                    );
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error(
                        'An error occurred while updating the Other Information. Please try again',
                        'ERROR!'
                    );
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                    this.bsModalRef.hide();
                },
            });
    }

    handleAddHumanResource() {
        this.humanResources.push({
            name: '',
            designation: '',
        });
    }

    // handleAddHumanResource(hrName: string) {
    //     if (hrName.replace(/\s/g, '')) {
    //         this.humanResources.push({
    //             id: new Date().getTime().toString(),
    //             name: hrName,
    //             designation: this.selectedDesignation,
    //             review: false,
    //         });
    //     }
    //     else {
    //         this.toastr.error(
    //             'Please input the name of the financial human resource',
    //             'ERROR!'
    //         );
    //     }
    // }

    handleCancelHumanResource() {
        this.selectedDesignation = 'Finance Officer';
    }

    handleOnSelect($event: string[]) {
        this.selectedDesignation = $event.at(0) ?? 'Finance Officer';
    }

    handleChangeEditInput($event: Event, index: number) {
        const value = ($event.target as any).value;
        this.humanResources[index]['name'] = value;
    }

    handleOnEditSelect($event: string[], index: number) {
        this.humanResources[index]['designation'] = $event?.at(0) ?? 'Finance Officer';
    }

    handleDeleteHumanResource(index: number) {
        this.humanResources.splice(index, 1);
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
