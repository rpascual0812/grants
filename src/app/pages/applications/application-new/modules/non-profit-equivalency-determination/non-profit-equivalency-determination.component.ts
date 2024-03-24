import { Component, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OTHER_CURRENCY_LIST } from '../../../../../utilities/constants';
import { InputDropdownValue } from '../input-dropdown/input-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
    selector: 'app-non-profit-equivalency-determination',
    templateUrl: './non-profit-equivalency-determination.component.html',
    styleUrls: ['./non-profit-equivalency-determination.component.scss'],
})
export class NonProfitEquivalencyDeterminationComponent {
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

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const currentApplication = this.applicationSignalService.appForm();
        const nonProfitEquivalencyDetermination = currentApplication?.application_nonprofit_equivalency_determination;
        this.form = this.formBuilder.group({
            pk: [nonProfitEquivalencyDetermination?.pk],
            application_pk: [currentApplication?.pk],
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
        });
        this.initialDescriptionsRequired();
        this.initialCurrenciesDefaultSelected();
    }

    initialCurrenciesDefaultSelected() {
        const currentApplication = this.applicationSignalService.appForm();
        const nonProfitEquivalencyDetermination = currentApplication?.application_nonprofit_equivalency_determination;

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
        if (['any_assets', 'any_payments'].includes(key)) {
            value === 'true'
                ? this.onAddDescriptionValidations(`${key}_description`)
                : this.onRemoveDescriptionValidations(`${key}_description`);
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

    saveFormValue(isNavigateNext?: boolean) {
        const currentApplication = this.applicationSignalService.appForm();
        const { value } = this.form;
        this.applicationService
            .saveApplicationNonProfitEquivalencyDetermination({
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.applicationSignalService.appForm.set({
                            ...currentApplication,
                            application_nonprofit_equivalency_determination: {
                                ...data,
                            },
                        });

                        this.toastr.success(
                            'Non-Profit Equivalency Determination has been successfully saved',
                            'SUCCESS!'
                        );

                        if (isNavigateNext) {
                            this.applicationSignalService.navigateNext();
                        } else {
                            this.applicationSignalService.navigateBack();
                        }
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Non-Profit Equivalency Determination. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(
                        `An error occurred while saving Non-Profit Equivalency Determination. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    handleReset() {
        this.form.reset({
            ...this.initialBooleanValue,
        });
        this.initialDescriptionsRequired();
    }

    processForm(isNavigateNext?: boolean) {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue(isNavigateNext);
        }
    }

    handleNext() {
        this.processForm(true);
    }

    handleBack() {
        this.processForm();
    }
}
