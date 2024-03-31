import { Component, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputDropdownValue } from '../input-dropdown/input-dropdown.component';
import { OTHER_CURRENCY_LIST, USD_CURRENCY } from '../../../../../utilities/constants';
import { ApplicationService } from 'src/app/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from 'src/app/services/document.service';
import * as _ from '../../../../../utilities/globals';
import { ProjectProposal } from 'src/app/interfaces/_application.interface';

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

    attachments: any = [];
    SERVER: string = _.BASE_URL;

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        private documentService: DocumentService
    ) {}

    ngOnInit() {
        this.getDurationOpts();
        this.setForm();

        const currentApplication = this.applicationSignalService.appForm();
        if (currentApplication?.documents) {
            currentApplication?.documents.forEach((document: any) => {
                if (document.type == 'proposed_activities_and_timeline') {
                    this.attachments.push(document);
                }
            });
            console.log(this.attachments);
        }
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
        const currentProposal = currentApplication?.project?.project_proposal;
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
        const currentProposal = currentApplication?.project?.project_proposal;
        const currentActivities = currentProposal?.project_proposal_activity ?? [];
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
        const proposal = currentApplication?.project?.project_proposal;
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
        const activities = currentApplication?.project?.project_proposal?.project_proposal_activity ?? [];
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

    saveCurrentAppForm(data: ProjectProposal) {
        const currentApplication = this.applicationSignalService.appForm();
        const project = currentApplication?.project;
        const projectProposal = project?.project_proposal;
        this.applicationSignalService.appForm.set({
            ...currentApplication,
            project: {
                ...project,
                project_proposal: {
                    ...data,
                    pk: data?.pk ?? projectProposal?.pk,
                    project_proposal_activity: [...(data?.project_proposal_activity ?? [])],
                },
            },
        });
    }

    saveFormValue() {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.appForm();
        const currentProject = currentApplication?.project;
        const projectProposal = currentProject?.project_proposal;

        this.applicationService
            .saveApplicationProposal({
                pk: projectProposal?.pk,
                project_pk: currentProject?.pk,
                ...value,
                project_proposal_activity: value?.application_proposal_activity ?? [],
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.saveCurrentAppForm(data);
                        this.toastr.success('Application Proposal has been successfully saved', 'SUCCESS!');
                        this.applicationSignalService.navigateNext();
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
        this.saveCurrentAppForm({
            ...value,
            project_proposal_activity: value?.application_proposal_activity ?? [],
        });
        this.applicationSignalService.navigateBack();
    }

    saveAttachment(ev: any) {
        const currentApplication = this.applicationSignalService.appForm();
        this.documentService
            .save({
                table_pk: currentApplication?.pk,
                table_name: 'applications',
                document_pk: ev.pk,
                type: 'proposed_activities_and_timeline',
            })
            .subscribe({
                next: (data: any) => {
                    this.toastr.success('The document has been successfully uploaded', 'SUCCESS!');
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while uploading the document. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                },
            });
    }
}
