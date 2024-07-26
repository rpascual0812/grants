import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/interfaces/_project.interface';
import { InputDropdownValue } from 'src/app/components/input-dropdown/input-dropdown.component';
import { ApplicationService } from 'src/app/services/application.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { OTHER_CURRENCY_LIST, USD_CURRENCY } from 'src/app/utilities/constants';
import { OnHiddenData } from '../../../grant-view.component';

@Component({
    selector: 'app-activities-and-timeline-view',
    templateUrl: './activities-and-timeline-view.component.html',
    styleUrls: ['./activities-and-timeline-view.component.scss'],
})
export class ActivitiesAndTimelineViewComponent implements OnInit {
    @Input() project: Project | null;

    processing = false;
    submitted = false;
    form: FormGroup;
    availableCurrencies = OTHER_CURRENCY_LIST;
    usdCurrencies = USD_CURRENCY;
    otherCurrenciesDefaultSelected = OTHER_CURRENCY_LIST.at(0)?.key;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const currentProposal = this.project?.project_proposal;
        this.form = this.formBuilder.group({
            monitor: [currentProposal?.monitor ?? '', Validators.required],
            budget_request_usd: [currentProposal?.budget_request_usd ?? '', Validators.required],
            budget_request_other: [currentProposal?.budget_request_other ?? '', Validators.required],
            budget_request_other_currency: [currentProposal?.budget_request_other_currency ?? '', Validators.required],
        });
        const selectedCurrencyKey = currentProposal?.budget_request_other_currency?.split('-').at(0)?.trim();
        this.otherCurrenciesDefaultSelected =
            OTHER_CURRENCY_LIST.find((currency) => currency?.key?.includes(selectedCurrencyKey ?? ''))?.key ??
            OTHER_CURRENCY_LIST.at(0)?.key;
    }

    onInputValueChange($event: InputDropdownValue, key: string) {
        if (key !== 'budget_request_usd') {
            const otherCurrencyLabel = $event?.selectedItem?.label;
            const otherCurrencyKey = $event?.selectedItem?.key;
            this.form.controls['budget_request_other_currency'].setValue(`${otherCurrencyKey} - ${otherCurrencyLabel}`);
        }
        this.form.controls[key].setValue($event?.value);
    }

    onSelectItemDropdown(_event: string, key: string) {
        if (key === 'budget_request_other') {
            this.form.controls[key].setValue('');
        }
    }

    handleClose() {
        this.bsModalRef.hide();
    }

    saveFormValue() {
        const { value } = this.form;
        const project = this.project;
        const projectProposal = project?.project_proposal;
        this.applicationService
            .saveApplicationProposal({
                pk: projectProposal?.pk,
                project_pk: project?.pk,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.toastr.success('Activities and Timeline has been successfully saved', 'SUCCESS!');
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                project: this.project,
                            },
                        } as OnHiddenData);
                        this.handleClose();
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Application ProposalActivities and Timeline. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Activities and Timeline. ${statusCode} ${errorMessage} Please try again.`,
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
            this.processing = true;
            this.saveFormValue();
        }
    }
}
