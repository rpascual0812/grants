import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
import { PartnerForm } from 'src/app/services/partner.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { OnHiddenData } from '../../../partner-view/partner-view.component';
import { PartnerOrganizationOtherInformation, Document } from 'src/app/interfaces/_application.interface';
import * as _ from '../../../../../utilities/globals';
import { DocumentService } from 'src/app/services/document.service';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';

@Component({
    selector: 'app-org-bank-account',
    templateUrl: './org-bank-account.component.html',
    styleUrls: ['./org-bank-account.component.scss'],
})
export class OrgBankAccountComponent implements OnInit {
    @Input() partner: PartnerForm | null = null;
    processing = false;
    submitted = false;
    form: FormGroup;
    SERVER: string = _.BASE_URL;

    agreements: any = [];
    financial_statements: any = [];

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        private documentService: DocumentService,
        private cdr: ChangeDetectorRef,
        public documentUploaderRef: BsModalRef,
        private modalService: BsModalService,
    ) { }

    ngOnInit() {
        this.setForm();

        this.agreements = this.partner?.partner_fiscal_sponsor?.documents;
        this.financial_statements = this.partner?.organization?.partner_organization_other_information?.documents ?? [];
    }

    setForm() {
        const appFiscalSponsor = this.partner?.partner_fiscal_sponsor;
        const organization = this.partner?.organization;
        const partnerOrgBank = organization?.partner_organization_bank;
        const partnerOrgOtherInfo = organization?.partner_organization_other_information;

        this.form = this.formBuilder.group({
            name: [appFiscalSponsor?.name ?? ''],
            address: [appFiscalSponsor?.address ?? ''],
            contact_number: [appFiscalSponsor?.contact_number ?? ''],
            email_address: [appFiscalSponsor?.email_address ?? '', Validators.email],
            head: [appFiscalSponsor?.head ?? ''],
            person_in_charge: [appFiscalSponsor?.person_in_charge ?? ''],
            bank_account_name: [appFiscalSponsor?.bank_account_name ?? ''],
            account_number: [appFiscalSponsor?.account_number ?? ''],
            bank_name: [appFiscalSponsor?.bank_name ?? ''],
            bank_branch: [appFiscalSponsor?.bank_branch ?? ''],
            bank_address: [appFiscalSponsor?.bank_address ?? ''],
            swift_code: [appFiscalSponsor?.swift_code ?? ''],
            partner_organization_bank: this.formBuilder.group({
                account_name: [partnerOrgBank?.account_name ?? ''],
                account_number: [partnerOrgBank?.account_number ?? ''],
                bank_branch: [partnerOrgBank?.bank_branch ?? ''],
                bank_name: [partnerOrgBank?.bank_name ?? ''],
                bank_address: [partnerOrgBank?.bank_address ?? ''],
                swift_code: [partnerOrgBank?.swift_code ?? ''],
            }),
            partner_organization_other_information: this.formBuilder.group({
                has_project: [partnerOrgOtherInfo?.has_project ?? false],
                has_financial_policy: [partnerOrgOtherInfo?.has_financial_policy ?? false],
                has_financial_policy_no_reason: [partnerOrgOtherInfo?.has_financial_policy_no_reason ?? ''],
                has_financial_system: [partnerOrgOtherInfo?.has_financial_system ?? false],
                has_financial_system_no_reason: [partnerOrgOtherInfo?.has_financial_system_no_reason ?? ''],
                audit_financial_available: [partnerOrgOtherInfo?.audit_financial_available ?? false],
                has_reviewed_financial_system: [partnerOrgOtherInfo?.has_reviewed_financial_system ?? false],
                recommendation: [partnerOrgOtherInfo?.recommendation ?? ''],
            }),
        });
        this.initialPartnerOrgOtherInfo(partnerOrgOtherInfo);
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

    onChangeSelectedBoolOpt(value: string, key: string) {
        this.form.controls?.['partner_organization_other_information']
            ?.get(key)
            ?.setValue(value === 'true' ? true : false);
        this.configureDescription(key, value);
    }

    configureDescription(key: string, value: string) {
        if (['has_financial_policy', 'has_financial_system'].includes(key)) {
            if (value === 'true') {
                this.form.controls?.['partner_organization_other_information']?.get(`${key}_no_reason`)?.setValue('');
                this.onRemoveDescriptionValidations(`${key}_no_reason`);
            }
            if (value === 'false') {
                this.onAddDescriptionValidations(`${key}_no_reason`);
            }
        }
    }

    onAddDescriptionValidations(key: string) {
        this.form?.controls?.['partner_organization_other_information']?.get(key)?.addValidators(Validators.required);
        this.form?.controls?.['partner_organization_other_information']?.get(key)?.updateValueAndValidity();
    }

    onRemoveDescriptionValidations(key: string) {
        this.form?.controls?.['partner_organization_other_information']?.get(key)?.setErrors(null);
        this.form?.controls?.['partner_organization_other_information']?.get(key)?.clearValidators();
        this.form?.controls?.['partner_organization_other_information']?.get(key)?.updateValueAndValidity();
    }

    saveFiscalSponsorForm() {
        this.processing = true;
        const partnerFiscalSponsor = this.partner?.partner_fiscal_sponsor;
        const { value } = this.form;
        value.documents = this.agreements;

        this.applicationService
            .saveApplicationFiscalSponsor({
                partner_pk: this.partner?.pk,
                pk: partnerFiscalSponsor?.pk,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        const savedData = {
                            ...this.partner,
                            partner_fiscal_sponsor: {
                                ...data,
                            },
                        };
                        this.savePartnerOrgBank(savedData);
                        this.toastr.success('Fiscal Sponsor Information has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Fiscal Sponsor Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Fiscal Sponsor. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    savePartnerOrgBank(data: PartnerForm) {
        this.processing = true;
        const partner = data;
        const { value } = this.form;
        const orgBankAccountValue = value?.partner_organization_bank;
        this.applicationService
            .savePartnerOrgBank({
                pk: this.partner?.organization?.partner_organization_bank?.pk,
                partner_organization_pk: this.partner?.organization?.pk,
                ...orgBankAccountValue,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        const savedData = {
                            ...partner,
                            organization: {
                                ...partner?.organization,
                                partner_organization_bank: {
                                    ...data,
                                },
                            },
                        };

                        this.savePartnerOtherInfoForm(savedData);
                        this.toastr.success('Organization Bank Account has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Organization Bank Account. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Organization Bank Account. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    savePartnerOtherInfoForm(data: PartnerForm) {
        this.processing = true;
        const partner = data;
        const { value } = this.form;
        const orgOtherInfo = value?.partner_organization_other_information;
        orgOtherInfo.documents = this.financial_statements;
        this.applicationService
            .savePartnerOtherInfo({
                pk: this.partner?.organization?.partner_organization_other_information?.pk,
                partner_organization_pk: this.partner?.organization?.pk,
                ...orgOtherInfo,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                ...partner,
                                organization: {
                                    ...partner?.organization,
                                    partner_organization_other_information: {
                                        ...data,
                                    },
                                },
                            },
                        } as OnHiddenData);
                        this.bsModalRef.hide();
                        this.toastr.success('Other Information has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Other Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Other Information. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    handleClose() {
        this.bsModalRef.hide();
    }

    handleSave() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFiscalSponsorForm();
        }
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
                        this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
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
        const documents = this.partner?.partner_fiscal_sponsor?.documents;
        // const uniqDocuments = documents?.filter((document) => document?.pk !== documentToBeRemoved?.pk);
        // this.applicationSignalService.appForm.set({
        //     ...currentApplication,
        //     partner: {
        //         ...currentApplication?.partner,
        //     },
        // });
    }

    uploadAgreement() {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.agreements.push(res.file);
            // this.form.get('documents')?.patchValue(this.agreements);
            this.cdr.detectChanges();
        });
    }

    uploadFinancialStatement() {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            console.log(res.file);
            this.financial_statements.push(res.file);
            console.log(this.financial_statements);
            // this.form.get('documents')?.patchValue(this.financial_statements);
            this.cdr.detectChanges();
        });
    }
}
