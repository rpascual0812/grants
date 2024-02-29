import { Component, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputDropdownValue } from '../input-dropdown/input-dropdown.component';
import { OTHER_CURRENCY_LIST, USD_CURRENCY } from '../../utilities/constants';

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
    activities: FormArray
    durationOpts: string[] = []
    proposedActivities: ProposedActivity[] = [];
    availableCurrencies = OTHER_CURRENCY_LIST;
    usdCurrencies = USD_CURRENCY;
    otherCurrenciesDefaultSelected = OTHER_CURRENCY_LIST.at(0)?.key;
    applicationSignalService = inject(ApplicationSignalService);

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.getDurationOpts();
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    
    get formActivities() {
        return <FormArray>this.form.get('activities');
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
        const currentApplication = this.applicationSignalService.application();
        const currentProposal = currentApplication?.proposal;
        this.form = this.formBuilder.group({
            monitor: [currentProposal?.monitor ?? '', Validators.required],
            budget_request_usd: [currentProposal?.budget_request_usd ?? ''],
            budget_request_other: [currentProposal?.budget_request_other ?? ''],
            budget_request_other_currency: [currentProposal?.budget_request_other_currency ?? ''],
            activities: this.formBuilder.array([], [Validators.required])
        });
        const selectedCurrencyKey = currentProposal?.budget_request_other_currency?.split('-').at(0)?.trim();
        this.otherCurrenciesDefaultSelected =
            OTHER_CURRENCY_LIST.find((currency) => currency?.key?.includes(selectedCurrencyKey ?? ''))?.key ??
            OTHER_CURRENCY_LIST.at(0)?.key;
        this.initialActivities()
    }

    initialActivities() {
        this.activities = this.form.get('activities') as FormArray;
        const currentApplication = this.applicationSignalService.application();
        const currentActivities = currentApplication?.proposal?.activities ?? [];
        currentActivities.forEach((act) => {
            this.activities.push(
                this.createFormActivities(act.name, act.duration)
            );
        });
    }

    createFormActivities(name?: string, duration?: string): FormGroup {
        return this.formBuilder.group({
            name: [name ?? '', Validators.required],
            duration: [duration ?? '', Validators.required],
        });
    }

    onAddActivity() {
        this.activities = this.form.get('activities') as FormArray;
        this.activities.push(this.createFormActivities());
    }

    onDelActivity(idx: number) {
        this.activities.removeAt(idx);
    }

    handleOnSelect($event: string[], idx: number) {
        const name = this.activities?.at(idx)?.get('name')?.value
        this.activities?.at(idx)?.setValue({
            name,
            duration: $event.at(0) ?? ''
        })
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

    saveFormValue() {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.application();
        this.applicationSignalService.application.set({
            ...currentApplication,
            proposal: {
                ...value,
            },
        });
    }

    handleNext() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.applicationSignalService.navigateNext();
            this.saveFormValue();
        }
    }

    handleBack() {
        this.saveFormValue();
        this.applicationSignalService.navigateBack();
    }
}
