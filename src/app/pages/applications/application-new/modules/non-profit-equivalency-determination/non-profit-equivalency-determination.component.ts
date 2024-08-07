import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OTHER_CURRENCY_LIST } from '../../../../../utilities/constants';
import { InputDropdownValue } from '../../../../../components/input-dropdown/input-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import * as _ from '../../../../../utilities/globals';
import { DocumentService } from 'src/app/services/document.service';
import { Document, PartnerNonProfitEquivalencyDetermination } from 'src/app/interfaces/_application.interface';

const DOCUMENT_TYPE = 'non_profit_equivalency_legal_registration';

@Component({
    selector: 'app-non-profit-equivalency-determination',
    templateUrl: './non-profit-equivalency-determination.component.html',
    styleUrls: ['./non-profit-equivalency-determination.component.scss'],
})
export class NonProfitEquivalencyDeterminationComponent {
    processing = false;
    form: FormGroup;
    submitted: boolean = false;
    availableCurrencies = OTHER_CURRENCY_LIST;
    otherCurrenciesDefaultSelected = {
        financial_last_year_other: OTHER_CURRENCY_LIST?.at(0)?.key,
        financial_current_other_currency: OTHER_CURRENCY_LIST?.at(0)?.key,
    };
    initialBooleanValue = {
        any_assets: true,
        any_payments: true,
        upon_dissolution: true,
        is_controlled_by: true,
    };
    applicationSignalService = inject(ApplicationSignalService);

    attachments: any = [];
    SERVER: string = _.BASE_URL;

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService,
        private documentService: DocumentService
    ) { }

    ngOnInit(): void {
        this.setForm();

        const currentApplication = this.applicationSignalService.appForm();
        this.attachments = currentApplication?.partner?.partner_nonprofit_equivalency_determination?.documents ?? [];
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const currentApplication = this.applicationSignalService.appForm();
        const nonProfitEquivalencyDetermination =
            currentApplication?.partner?.partner_nonprofit_equivalency_determination;
        this.form = this.formBuilder.group({
            year: [nonProfitEquivalencyDetermination?.year, Validators.required],
            financial_last_year_usd: [
                nonProfitEquivalencyDetermination?.financial_last_year_usd ?? '',
                Validators.required,
            ],
            financial_last_year_other: [
                nonProfitEquivalencyDetermination?.financial_last_year_other ?? '',
                Validators.required,
            ],
            financial_last_year_other_currency: [
                nonProfitEquivalencyDetermination?.financial_last_year_other_currency ?? '',
                Validators.required,
            ],
            financial_last_year_source: [
                nonProfitEquivalencyDetermination?.financial_last_year_source ?? '',
                Validators.required,
            ],
            financial_current_usd: [
                nonProfitEquivalencyDetermination?.financial_current_usd ?? '',
                Validators.required,
            ],
            financial_current_other: [
                nonProfitEquivalencyDetermination?.financial_current_other ?? '',
                Validators.required,
            ],
            financial_current_other_currency: [
                nonProfitEquivalencyDetermination?.financial_current_other_currency ?? '',
                Validators.required,
            ],
            financial_current_source: [
                nonProfitEquivalencyDetermination?.financial_current_source ?? '',
                Validators.required,
            ],
            officers: [nonProfitEquivalencyDetermination?.officers ?? '', Validators.required],
            members: [nonProfitEquivalencyDetermination?.members ?? '', Validators.required],
            operated_for_others: [nonProfitEquivalencyDetermination?.operated_for_others ?? ''],
            any_assets: [
                nonProfitEquivalencyDetermination?.any_assets ?? this.initialBooleanValue.any_assets,
                Validators.required,
            ],
            any_assets_description: [nonProfitEquivalencyDetermination?.any_assets_description ?? ''],
            any_payments: [
                nonProfitEquivalencyDetermination?.any_payments ?? this.initialBooleanValue.any_payments,
                Validators.required,
            ],
            any_payments_description: [nonProfitEquivalencyDetermination?.any_payments_description ?? ''],
            upon_dissolution: [
                nonProfitEquivalencyDetermination?.upon_dissolution ?? this.initialBooleanValue.upon_dissolution,
                Validators.required,
            ],
            is_controlled_by: [
                nonProfitEquivalencyDetermination?.is_controlled_by ?? this.initialBooleanValue.is_controlled_by,
                Validators.required,
            ],
            operated_for: this.formBuilder.group({
                charitable: [nonProfitEquivalencyDetermination?.operated_for?.charitable ?? false],
                literacy: [nonProfitEquivalencyDetermination?.operated_for?.literacy ?? false],
                cultural: [nonProfitEquivalencyDetermination?.operated_for?.cultural ?? false],
                religious: [nonProfitEquivalencyDetermination?.operated_for?.religious ?? false],
                education_purpose: [nonProfitEquivalencyDetermination?.operated_for?.education_purpose ?? false],
                scientific: [nonProfitEquivalencyDetermination?.operated_for?.scientific ?? false],
            }),
            documents: ['']
        });
        this.initialDescriptionsRequired();
        this.initialCurrenciesDefaultSelected();
    }

    initialCurrenciesDefaultSelected() {
        const currentApplication = this.applicationSignalService.appForm();
        const nonProfitEquivalencyDetermination =
            currentApplication?.partner?.partner_nonprofit_equivalency_determination;

        const selectedCurrencyLastYearKey = nonProfitEquivalencyDetermination?.financial_last_year_other_currency
            ?.split('-')
            .at(0)
            ?.trim();
        this.otherCurrenciesDefaultSelected.financial_last_year_other =
            OTHER_CURRENCY_LIST.find((currency) => currency?.key?.includes(selectedCurrencyLastYearKey ?? ''))?.key ??
            OTHER_CURRENCY_LIST.at(0)?.key;

        const selectedCurrencyCurrentYearKey = nonProfitEquivalencyDetermination?.financial_current_other_currency
            ?.split('-')
            .at(0)
            ?.trim();
        this.otherCurrenciesDefaultSelected.financial_current_other_currency =
            OTHER_CURRENCY_LIST.find((currency) => currency?.key?.includes(selectedCurrencyCurrentYearKey ?? ''))
                ?.key ?? OTHER_CURRENCY_LIST.at(0)?.key;
    }

    initialDescriptionsRequired() {
        if (this.form.get('any_payments')?.value) {
            this.onAddDescriptionValidations('any_payments_description');
        }

        if (this.form.get('any_assets')?.value) {
            this.onAddDescriptionValidations('any_assets_description');
        }
    }

    onInputValueChange($event: InputDropdownValue, key: string) {
        const otherCurrencyLabel = $event?.selectedItem?.label;
        const otherCurrencyKey = $event?.selectedItem?.key;
        if (key === 'financial_last_year_other') {
            this.form.controls['financial_last_year_other_currency'].setValue(
                `${otherCurrencyKey} - ${otherCurrencyLabel}`
            );
        }

        if (key === 'financial_current_other') {
            this.form.controls['financial_current_other_currency'].setValue(
                `${otherCurrencyKey} - ${otherCurrencyLabel}`
            );
        }

        this.form.controls[key].setValue($event?.value);
    }

    onSelectItemDropdown(_event: string, key: string) {
        this.form.controls[key].setValue('');
    }

    onChangeSelectedBoolOpt(value: string, key: string) {
        this.form.controls[key].setValue(value === 'true' ? true : false);
        this.configureDescription(key, value);
    }

    configureDescription(key: string, value: string) {
        if (['any_assets', 'any_payments'].includes(key)) {
            if (value === 'false') {
                this.form.controls[`${key}_description`].setValue('');
                this.onRemoveDescriptionValidations(`${key}_description`);
            }
            if (value === 'true') {
                this.onAddDescriptionValidations(`${key}_description`);
            }
        }
    }

    onAddDescriptionValidations(key: string) {
        this.form?.controls[key]?.addValidators(Validators.required);
        this.form?.controls[key]?.updateValueAndValidity();
    }

    onRemoveDescriptionValidations(key: string) {
        this.form?.controls[key]?.setErrors(null);
        this.form?.controls[key]?.clearValidators();
        this.form?.controls[key]?.updateValueAndValidity();
    }

    saveCurrentAppForm(data: PartnerNonProfitEquivalencyDetermination) {
        const currentApplication = this.applicationSignalService.appForm();
        const partner = currentApplication?.partner;
        const nonProfitEquivalencyDetermination = partner?.partner_nonprofit_equivalency_determination;
        this.applicationSignalService.appForm.set({
            ...currentApplication,
            partner: {
                ...partner,
                partner_nonprofit_equivalency_determination: {
                    pk: data?.pk ?? nonProfitEquivalencyDetermination?.pk,
                    partner_pk: partner?.pk,
                    ...partner?.partner_nonprofit_equivalency_determination,
                    ...data,
                },
            },
        });
    }

    saveFormValue() {
        this.processing = true;
        const currentApplication = this.applicationSignalService.appForm();
        const partner = currentApplication?.partner;
        const nonProfitEquivalencyDetermination = partner?.partner_nonprofit_equivalency_determination;
        const { value } = this.form;
        this.applicationService
            .saveApplicationNonProfitEquivalencyDetermination({
                pk: nonProfitEquivalencyDetermination?.pk,
                partner_pk: partner?.pk,
                ...value,
                operated_for_others: value.operated_for_others ?? '',
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.saveCurrentAppForm(data);
                        this.toastr.success(
                            'Non-Profit Equivalency Determination has been successfully saved',
                            'SUCCESS!'
                        );
                        this.applicationSignalService.navigateNext();
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Non-Profit Equivalency Determination. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(
                        `An error occurred while saving Non-Profit Equivalency Determination. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    handleReset() {
        this.form.reset({
            ...this.initialBooleanValue,
        });
        this.initialDescriptionsRequired();
    }

    handleNext() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
        }
    }

    handleBack() {
        const { value } = this.form;
        this.saveCurrentAppForm(value);
        this.applicationSignalService.navigateBack();
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

    setPartnerDocuments(currentAttachments: Document[], documentType: string) {
        const currentApplication = this.applicationSignalService.appForm();
        const documents = currentApplication?.partner?.documents;

        const attachments =
            currentAttachments.map((attachment: any) => ({
                ...attachment,
                type: documentType,
            })) ?? [];

        const consolidatedDocuments = [...(documents ?? []), ...attachments];
        const uniqDocuments = this.applicationSignalService?.removeDocumentDuplicates(consolidatedDocuments);

        this.applicationSignalService.appForm.set({
            ...currentApplication,
            partner: {
                ...currentApplication?.partner,
                documents: [...(uniqDocuments ?? [])],
            },
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
        const currentApplication = this.applicationSignalService.appForm();
        const documents = currentApplication?.partner?.documents;
        const uniqDocuments = documents?.filter((document) => document?.pk !== documentToBeRemoved?.pk);
        this.applicationSignalService.appForm.set({
            ...currentApplication,
            partner: {
                ...currentApplication?.partner,
                documents: [...(uniqDocuments ?? [])],
            },
        });
    }
}
