import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { InputDropdownValue } from 'src/app/components/input-dropdown/input-dropdown.component';
import { ApplicationService } from 'src/app/services/application.service';
import { PartnerForm } from 'src/app/services/partner.signal.service';
import { OTHER_CURRENCY_LIST } from 'src/app/utilities/constants';
import { OnHiddenData } from '../../../partner-view/partner-view.component';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import * as _ from '../../../../../utilities/globals';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';

@Component({
    selector: 'app-non-profit-equival-deter-view',
    templateUrl: './non-profit-equival-deter-view.component.html',
    styleUrls: ['./non-profit-equival-deter-view.component.scss'],
})
export class NonProfitEquivalDeterViewComponent implements OnInit {
    @Input() partner: PartnerForm | null = null;
    processing = false;
    submitted = false;
    form: FormGroup;
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
    ) { }

    ngOnInit() {
        this.attachments = this.partner?.partner_nonprofit_equivalency_determination?.documents ?? [];
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }
    setForm() {
        const nonProfitEquivalencyDetermination = this.partner?.partner_nonprofit_equivalency_determination;
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
            documents: []
        });
        this.initialDescriptionsRequired();
        this.initialCurrenciesDefaultSelected();
    }

    initialCurrenciesDefaultSelected() {
        const nonProfitEquivalencyDetermination = this.partner?.partner_nonprofit_equivalency_determination;

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
        this.configureDescription(key, value)
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

    saveFormValue() {
        this.processing = true;
        const nonProfitEquivalDeterViewComponent = this.partner?.partner_nonprofit_equivalency_determination;
        const { value } = this.form;
        this.applicationService
            .saveApplicationNonProfitEquivalencyDetermination({
                pk: nonProfitEquivalDeterViewComponent?.pk,
                partner_pk: this.partner?.pk,
                ...value,
                operated_for_others: value.operated_for_others ?? '',
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                ...this.partner,
                                partner_nonprofit_equivalency_determination: {
                                    ...data,
                                },
                            },
                        } as OnHiddenData);
                        this.bsModalRef.hide();
                        this.toastr.success(
                            'Non Profit Equivalency Determination has been successfully saved',
                            'SUCCESS!'
                        );
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Non-Profit Equivalency Determination. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Non-Profit Equivalency Determination. ${statusCode} ${errorMessage} Please try again.`,
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
