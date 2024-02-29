import { Component, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OTHER_CURRENCY_LIST } from '../../utilities/constants';
import { InputDropdownValue } from '../input-dropdown/input-dropdown.component';

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
    applicationSignalService = inject(ApplicationSignalService);

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const currentApplication = this.applicationSignalService.application();
        const nonProfitEquivalencyDetermination = currentApplication?.non_profit_equivalency_determination;
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
            any_assets: [nonProfitEquivalencyDetermination?.any_assets ?? true, Validators.required],
            any_assets_description: [nonProfitEquivalencyDetermination?.any_assets_description ?? ''],
            any_payments: [nonProfitEquivalencyDetermination?.any_payments ?? true, Validators.required],
            any_payments_description: [nonProfitEquivalencyDetermination?.any_payments_description ?? ''],
            upon_dissolution: [nonProfitEquivalencyDetermination?.upon_dissolution ?? true, Validators.required],
            is_controlled_by: [nonProfitEquivalencyDetermination?.is_controlled_by ?? true, Validators.required],
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
        const currentApplication = this.applicationSignalService.application();
        const nonProfitEquivalencyDetermination = currentApplication?.non_profit_equivalency_determination;

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

    saveFormValue() {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.application();
        this.applicationSignalService.application.set({
            ...currentApplication,
            non_profit_equivalency_determination: {
                ...value,
            },
        });
    }

    handleNext() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
            this.applicationSignalService.navigateNext();
        }
    }

    handleBack() {
        this.saveFormValue();
        this.applicationSignalService.navigateBack();
    }
}
