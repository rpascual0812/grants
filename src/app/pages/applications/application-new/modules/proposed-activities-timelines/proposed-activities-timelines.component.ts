import { Component, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputDropdownValue } from '../input-dropdown/input-dropdown.component';
import { OTHER_CURRENCY_LIST, USD_CURRENCY } from '../../../../../utilities/constants';
import { ApplicationService } from 'src/app/services/application.service';
import { ToastrService } from 'ngx-toastr';

interface ProposedActivity {
    id: number;
    activityName: string;
    duration: string;
}

@Component({
    selector: 'app-proposed-activities-timelines',
    templateUrl: './proposed-activities-timelines.component.html',
    styleUrls: ['./proposed-activities-timelines.component.scss'],
})
export class ProposedActivitiesTimelinesComponent {
    submitted = false;
    form: FormGroup;
    activities: FormArray;
    durationOpts: string[] = [];
    proposedActivities: ProposedActivity[] = [];
    availableCurrencies = OTHER_CURRENCY_LIST;
    usdCurrencies = USD_CURRENCY;
    otherCurrenciesDefaultSelected = OTHER_CURRENCY_LIST.at(0)?.key;
    applicationSignalService = inject(ApplicationSignalService);

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.getDurationOpts();
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    get formActivities() {
        return <FormArray>this.form.get('application_proposal_activity');
    }

    getDurationOpts() {
        for (let i = 1; i <= 36; i++) {
            let suffix = 'Months';
            if (i === 1) {
                suffix = 'Month';
            }
            this.durationOpts.push(`${i} ${suffix}`);
        }
    }

    setForm() {
        const currentApplication = this.applicationSignalService.appForm();
        const currentProposal = currentApplication?.application_proposal;
        this.form = this.formBuilder.group({
            monitor: [currentProposal?.monitor ?? '', Validators.required],
            budget_request_usd: [currentProposal?.budget_request_usd ?? ''],
            budget_request_other: [currentProposal?.budget_request_other ?? ''],
            budget_request_other_currency: [currentProposal?.budget_request_other_currency ?? ''],
            application_proposal_activity: this.formBuilder.array([], [Validators.required]),
        });
        const selectedCurrencyKey = currentProposal?.budget_request_other_currency?.split('-').at(0)?.trim();
        this.otherCurrenciesDefaultSelected =
            OTHER_CURRENCY_LIST.find((currency) => currency?.key?.includes(selectedCurrencyKey ?? ''))?.key ??
            OTHER_CURRENCY_LIST.at(0)?.key;
        this.initialActivities();
    }

    initialActivities() {
        this.activities = this.form.get('application_proposal_activity') as FormArray;
        const currentApplication = this.applicationSignalService.appForm();
        const currentActivities = currentApplication?.application_proposal?.application_proposal_activity ?? [];
        currentActivities.forEach((act) => {
            this.activities.push(this.createFormActivities(act?.pk, act.name, act.duration));
        });
    }

    createFormActivities(pk?: number, name?: string, duration?: string): FormGroup {
        return this.formBuilder.group({
            pk: [pk ?? ''],
            name: [name ?? '', Validators.required],
            duration: [duration ?? '', Validators.required],
        });
    }

    onAddActivity() {
        this.activities = this.form.get('application_proposal_activity') as FormArray;
        this.activities.push(this.createFormActivities());
    }

    onDelActivity(idx: number) {
        const currentApplication = this.applicationSignalService.appForm();
        const proposal = currentApplication?.application_proposal;
        const proposalPk = proposal?.pk ?? null;
        const tempActPk = this.activities.at(idx).get('pk')?.value;
        const activityPk = typeof tempActPk === 'string' || !tempActPk ? null : tempActPk;
        if (activityPk && proposalPk) {
            this.applicationService
                .deleteAppProposalAct({
                    proposalPk,
                    activityPk,
                })
                .subscribe({
                    next: (res: any) => {
                        const status = res?.status;
                        if (status) {
                            this.activities.removeAt(idx);
                        } else {
                            this.toastr.error(`An error occurred while deleting Activity. Please try again.`, 'ERROR!');
                        }
                    },
                    error: (err) => {
                        this.toastr.error(`An error occurred while deleting Activity. Please try again.`, 'ERROR!');
                    },
                });
        } else {
            this.activities.removeAt(idx);
        }
    }

    handleOnSelect($event: string[], idx: number) {
        const name = this.activities?.at(idx)?.get('name')?.value;
        const currentApplication = this.applicationSignalService.appForm();
        const activities = currentApplication?.application_proposal?.application_proposal_activity ?? [];
        const activity = activities?.at(idx);
        this.activities?.at(idx)?.setValue({
            pk: activity?.pk ?? '',
            name,
            duration: $event.at(0) ?? '',
        });
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

    saveFormValue(isNavigateNext?: boolean) {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.appForm();
        const proposal = currentApplication?.application_proposal;

        this.applicationService
            .saveApplicationProposal({
                pk: proposal?.pk,
                application_pk: currentApplication?.pk,
                ...value,
                application_proposal_activity: value?.application_proposal_activity ?? [],
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.applicationSignalService.appForm.set({
                            ...currentApplication,
                            application_proposal: {
                                ...data,
                            },
                        });

                        this.toastr.success('Application Proposal has been successfully saved', 'SUCCESS!');

                        if (isNavigateNext) {
                            this.applicationSignalService.navigateNext();
                        } else {
                            this.applicationSignalService.navigateBack();
                        }
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Application Proposal. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(
                        `An error occurred while saving Application Proposal. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    handleReset() {
        this.form.reset();
        // this.activities.clear();
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
