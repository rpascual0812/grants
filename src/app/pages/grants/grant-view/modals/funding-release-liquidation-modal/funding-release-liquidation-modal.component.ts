import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProjectFunding, ProjectFundingLiquidation } from 'src/app/interfaces/_project.interface';
import { InputDropdownValue } from 'src/app/pages/applications/application-new/modules/input-dropdown/input-dropdown.component';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { OTHER_CURRENCY_LIST, getOtherCurrencyKey } from 'src/app/utilities/constants';

export type onHiddenDataFundingLiquidation = {
    isSaved: boolean;
    data: ProjectFundingLiquidation | null;
};

const parseFormDate = (date: Date) => {
    return formatDate(date, 'yyyy-MM-dd', 'en');
};

@Component({
    selector: 'app-funding-release-liquidation-modal',
    templateUrl: './funding-release-liquidation-modal.component.html',
    styleUrls: ['./funding-release-liquidation-modal.component.scss'],
})
export class FundingReleaseLiquidationModalComponent implements OnInit {
    processing = false;
    submitted: boolean = false;
    projectPk: number;
    projectFunding: ProjectFunding[] = [];
    projectFundingLiquidation: ProjectFundingLiquidation | null = null;
    form: FormGroup;

    availableCurrencies = OTHER_CURRENCY_LIST;
    otherCurrenciesDefaultSelected = OTHER_CURRENCY_LIST?.at(0)?.key;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private projectService: ProjectService,
        private modalService: BsModalService,
        private toastr: ToastrService
    ) {
        this.projectFunding = (modalService?.config?.initialState as any)?.projectFunding;
        this.projectFundingLiquidation = (modalService?.config?.initialState as any)?.projectFundingLiquidation ?? null;
    }

    get f() {
        return this.form.controls;
    }

    ngOnInit() {
        this.setForm();
    }

    getAvailableTranche = () => {
        // return this.projectFunding?.filter((item) => !item?.project_funding_liquidation?.pk);
        return this.projectFunding;
    };

    setForm() {
        this.form = this.formBuilder.group({
            status: [this.projectFundingLiquidation?.status ?? '', Validators.required],
            description: [this.projectFundingLiquidation?.description ?? '', Validators.required],
            amount_usd: [this.projectFundingLiquidation?.amount_usd, Validators.required],
            amount_other: [this.projectFundingLiquidation?.amount_other ?? '', Validators.required],
            amount_other_currency: [this.projectFundingLiquidation?.amount_other_currency ?? '', Validators.required],
            date_released: [
                this.projectFundingLiquidation?.date_released
                    ? parseFormDate(this.projectFundingLiquidation?.date_released)
                    : '',
                Validators.required,
            ],
        });
        const selectedCurrencyKey = this.projectFundingLiquidation?.amount_other_currency ?? '';
        this.otherCurrenciesDefaultSelected = getOtherCurrencyKey(selectedCurrencyKey);
    }

    onInputValueChange($event: InputDropdownValue, key: string) {
        const otherCurrencyLabel = $event?.selectedItem?.label;
        const otherCurrencyKey = $event?.selectedItem?.key;
        this.form.controls[`${key}_currency`].setValue(`${otherCurrencyKey} - ${otherCurrencyLabel}`);
        this.form.controls[key].setValue($event?.value);
    }

    onChangeSelectedOpt(value: string, key: string) {
        this.form.controls[key].setValue(value);
    }

    onSelectItemDropdown(_event: string, key: string) {
        this.form.controls[key].setValue('');
    }

    saveFormValue() {
        const { value } = this.form;
        const status = value?.status;
        const selectedProjectFunding = this.projectFunding?.find((funding) => funding?.title === status);
        this.projectService
            .saveProjectFundingLiquidation({
                project_funding_pk: selectedProjectFunding?.pk ?? this.projectFundingLiquidation?.project_funding_pk,
                pk: this.projectFundingLiquidation?.pk,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                ...data,
                            },
                        } as onHiddenDataFundingLiquidation);
                        this.handleClose();
                        this.toastr.success('Liquidation has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(`An error occurred while saving Liquidation. Please try again.`, 'ERROR!');
                    }
                    this.processing = false;
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Liquidation. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    handleSave() {
        this.submitted = true;
        this.processing = true;
        const { valid } = this.form;
        if (valid) {
            this.saveFormValue();
        }
    }

    handleClose() {
        this.bsModalRef.hide();
    }
}
