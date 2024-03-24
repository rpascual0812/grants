import { ApplicationProjectLocationRead } from './../../../interfaces/application.interface';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getDurationOpts } from 'src/app/utilities/application.utils';
import { OTHER_CURRENCY_LIST, PROVINCE_URL_FETCH_STATUS, USD_CURRENCY } from '../application-new/utilities/constants';
import { InputDropdownValue } from '../application-new/modules/input-dropdown/input-dropdown.component';
import { ApplicationRead } from 'src/app/interfaces/application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

type SelectItem = {
    pk?: number;
    province_code?: number;
    name: string;
};

@Component({
    selector: 'app-application-proj-info',
    templateUrl: './application-proj-info.component.html',
    styleUrls: ['./application-proj-info.component.scss'],
})
export class ApplicationProjInfoComponent implements OnInit {
    pk = '';
    loading = false;
    submitted = false;
    durationOpts: string[] = [];
    form: FormGroup;
    provinceUrlFetchStatus = PROVINCE_URL_FETCH_STATUS;
    usdCurrencies = USD_CURRENCY;
    availableCurrencies = OTHER_CURRENCY_LIST;
    otherCurrenciesDefaultSelected = {
        budget_request_other: OTHER_CURRENCY_LIST?.at(0)?.key,
        financial_last_year_other: OTHER_CURRENCY_LIST?.at(0)?.key,
        financial_current_other: OTHER_CURRENCY_LIST?.at(0)?.key,
    };
    projectLoc: FormArray;
    application: ApplicationRead = {};

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        route: ActivatedRoute
    ) {
        this.pk = route.snapshot.paramMap.get('pk') ?? '';
    }

    get f() {
        return this.form.controls;
    }

    get formProjLocations() {
        return <FormArray>this.form.get('project_locations');
    }

    ngOnInit() {
        this.fetch();
        this.setForm();
        this.durationOpts = getDurationOpts();
    }

    fetch() {
        this.loading = true;
        this.applicationService.fetchOne(this.pk).subscribe({
            next: (res: any) => {
                const data = res?.data as ApplicationRead;
                this.form.controls['title'].setValue(data?.project?.title);
                this.form.controls['duration'].setValue(data?.project?.duration);
                this.form.controls['background'].setValue(data?.project?.background);
                this.form.controls['objective'].setValue(data?.project?.objective);
                this.form.controls['expected_output'].setValue(data?.project?.expected_output);
                this.form.controls['how_will_affect'].setValue(data?.project?.how_will_affect);

                this.initialProjLocations(data?.project?.project_location ?? []);

                this.form.controls['project_website'].setValue(data?.application_organization_profile?.project_website);

                this.form.controls['budget_request_usd'].setValue(data?.application_proposal?.budget_request_usd);
                this.form.controls['budget_request_other'].setValue(data?.application_proposal?.budget_request_other);
                this.form.controls['budget_request_other_currency'].setValue(
                    data?.application_proposal?.budget_request_other_currency
                );
                this.initialOtherCurrencySelected(
                    'budget_request_other',
                    data?.application_proposal?.budget_request_other_currency ?? ''
                );

                this.form.controls['monitor'].setValue(data?.application_proposal?.monitor);
                this.form.controls['year'].setValue(data?.application_nonprofit_equivalency_determination?.year);

                this.form.controls['financial_last_year_usd'].setValue(
                    data?.application_nonprofit_equivalency_determination?.financial_last_year_usd
                );
                this.form.controls['financial_last_year_other'].setValue(
                    data?.application_nonprofit_equivalency_determination?.financial_last_year_other
                );
                this.initialOtherCurrencySelected(
                    'financial_last_year_other',
                    data?.application_nonprofit_equivalency_determination?.financial_last_year_other_currency ?? ''
                );

                this.form.controls['financial_current_usd'].setValue(
                    data?.application_nonprofit_equivalency_determination?.financial_current_usd
                );
                this.form.controls['financial_current_other'].setValue(
                    data?.application_nonprofit_equivalency_determination?.financial_current_other
                );
                this.initialOtherCurrencySelected(
                    'financial_current_other',
                    data?.application_nonprofit_equivalency_determination?.financial_current_other_currency ?? ''
                );

                this.form.controls['members'].setValue(data?.application_nonprofit_equivalency_determination?.members);
                this.form.controls['officers'].setValue(
                    data?.application_nonprofit_equivalency_determination?.officers
                );
                this.loading = false;
            },
            error: (err) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(
                    `An error occurred while fetching application. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    setForm() {
        this.form = this.formBuilder.group({
            title: [this.application?.project?.title ?? '', Validators.required],
            duration: [this.application?.project?.duration ?? '', Validators.required],
            background: [this.application?.project?.background ?? '', Validators.required],
            objective: [this.application?.project?.objective ?? '', Validators.required],
            expected_output: [this.application?.project?.expected_output ?? '', Validators.required],
            how_will_affect: [this.application?.project?.how_will_affect ?? '', Validators.required],
            project_website: [this.application?.application_organization_profile?.project_website ?? ''],
            project_locations: this.formBuilder.array([], [Validators.required]),
            monitor: [this.application?.application_proposal?.monitor ?? '', Validators?.required],
            budget_request_usd: [this.application?.application_proposal?.budget_request_usd ?? ''],
            budget_request_other: [this.application?.application_proposal?.budget_request_other ?? ''],
            budget_request_other_currency: [
                this.application?.application_proposal?.budget_request_other_currency ?? '',
            ],
            year: [this.application?.application_nonprofit_equivalency_determination?.year, Validators.required],
            financial_last_year_usd: [
                this.application?.application_nonprofit_equivalency_determination?.financial_last_year_usd,
                Validators.required,
            ],
            financial_last_year_other: [
                this.application?.application_nonprofit_equivalency_determination?.financial_last_year_other,
                Validators.required,
            ],
            financial_last_year_other_currency: [
                this.application?.application_nonprofit_equivalency_determination?.financial_last_year_other_currency ??
                '',
                Validators.required,
            ],
            financial_current_usd: [
                this.application?.application_nonprofit_equivalency_determination?.financial_current_usd,
                Validators.required,
            ],
            financial_current_other: [
                this.application?.application_nonprofit_equivalency_determination?.financial_current_other,
                Validators.required,
            ],
            financial_current_other_currency: [
                this.application?.application_nonprofit_equivalency_determination?.financial_current_other_currency ??
                '',
                Validators.required,
            ],
            members: [this.application?.application_nonprofit_equivalency_determination?.members, Validators.required],
            officers: [
                this.application?.application_nonprofit_equivalency_determination?.officers,
                Validators.required,
            ],
        });
    }

    initialProjLocations(currentProjLoc: ApplicationProjectLocationRead[]) {
        this.projectLoc = this.form.get('project_locations') as FormArray;
        currentProjLoc.forEach((proj) => {
            this.projectLoc.push(
                this.createFormProjLocations(proj.country_pk, proj.province_code, this.provinceUrlFetchStatus.ready)
            );
        });
    }

    initialOtherCurrencySelected(key: string, selectedCurrency: string) {
        const selectedCurrencyKey = selectedCurrency?.split('-').at(0)?.trim();
        const targetKey = key as keyof typeof this.otherCurrenciesDefaultSelected;
        this.otherCurrenciesDefaultSelected[targetKey] =
            OTHER_CURRENCY_LIST.find((currency) => currency?.key?.includes(selectedCurrencyKey ?? ''))?.key ??
            OTHER_CURRENCY_LIST.at(0)?.key;
    }

    createFormProjLocations(countryPk?: number, provinceCode?: number, urlFetchStatus?: string): FormGroup {
        return this.formBuilder.group({
            country_pk: [countryPk ?? '', Validators.required],
            province_code: [provinceCode ?? '', Validators.required],
            province_code_url: [urlFetchStatus ?? this.provinceUrlFetchStatus.notReady],
        });
    }

    onAddProjLoc() {
        this.projectLoc = this.form.get('project_locations') as FormArray;
        this.projectLoc.push(this.createFormProjLocations());
    }

    onDelProjLoc(idx: number) {
        this.projectLoc.removeAt(idx);
    }

    onChangeSelectedItem(item: SelectItem[] | string[], key: string) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.pk ?? '';
        if (pk) {
            this.form.controls[key].setValue(pk);
        } else {
            this.form.controls[key].setValue(extractedItem ?? '');
        }
    }

    onModifyProjLoc(
        item: SelectItem[],
        listItemKey: 'pk' | 'province_code',
        key: 'country_pk' | 'province_code',
        idx: number
    ) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.[listItemKey ?? ''] ?? '';
        if (key === 'country_pk') {
            this.projectLoc.controls.at(idx)?.setValue({
                country_pk: pk,
                province_code: '',
                province_code_url: this.provinceUrlFetchStatus.notReady,
            });
            this.refetchProvinceList(idx, pk);
        } else {
            this.projectLoc.controls.at(idx)?.setValue({
                country_pk: this.projectLoc.at(idx).get('country_pk')?.value,
                province_code: pk,
                province_code_url: this.provinceUrlFetchStatus.ready,
            });
        }
    }

    refetchProvinceList(idx: number, pk: number | string) {
        setTimeout(() => {
            this.projectLoc.controls.at(idx)?.setValue({
                country_pk: pk,
                province_code: '',
                province_code_url: this.provinceUrlFetchStatus.ready,
            });
        }, 500);
    }

    isNotValidKeyNumber(countryPk: number) {
        return typeof countryPk !== 'number';
    }

    onInputValueChange($event: InputDropdownValue, key: string) {
        const otherCurrencyLabel = $event?.selectedItem?.label;
        const otherCurrencyKey = $event?.selectedItem?.key;
        if (key === 'budget_request_other') {
            this.form.controls['budget_request_other_currency'].setValue(`${otherCurrencyKey} - ${otherCurrencyLabel}`);
        }

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

    handleSave() {
        const { value } = this.form;
        // TODO: remove logs
        console.log('handleSave ~ value:', value);
    }
}
