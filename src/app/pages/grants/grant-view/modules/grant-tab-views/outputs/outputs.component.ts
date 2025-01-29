import { ChangeDetectorRef, Component, OnInit, effect, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/interfaces/_project.interface';
import { GlobalService } from 'src/app/services/global.service';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import * as _ from '../../../../../../utilities/globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSignalService } from 'src/app/services/user.signal.service';
import { User } from 'src/app/interfaces/_application.interface';

@Component({
    selector: 'app-outputs',
    templateUrl: './outputs.component.html',
    styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {
    form: FormGroup;
    submitted: boolean = false;

    objectives: any = [];
    results: any = [];

    project_output: any = {};

    output: any = {
        objective: {
            content: '',
            commentor: '',
        },
        result: {
            content: '',
            commentor: '',
        }
    }

    editable: any = {
        objective: {
            content: '',
            commentor: '',
        },
        result: {
            content: '',
            commentor: '',
        }
    }

    project: Project | null = null;

    disable_tenure_security: boolean = false;

    grantSignalService = inject(GrantSignalService);

    user: User | null = {};
    userSignalService = inject(UserSignalService);

    restrictions: any = _.RESTRICTIONS;
    permission = _.PERMISSIONS;

    constructor(
        private globalService: GlobalService,
        private projectService: ProjectService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {
        effect(() => {
            this.user = this.userSignalService.user();

            this.user?.user_role?.forEach((user_role: any) => {
                this.permission.contract_finalization = this.restrictions[user_role.role.restrictions.contract_finalization] > this.restrictions[this.permission.contract_finalization] ? user_role.role.restrictions.contract_finalization : this.permission.contract_finalization;
            });
        });
    }

    ngOnInit() {
        this.project = this.grantSignalService.project();
        this.fetchObjectiveResult();
        this.fetchOutput();

        this.form = this.formBuilder.group({
            // A
            tenure_security: [this.project_output.tenure_security ? this.project_output.tenure_security : 'yes'],
            tenure_security_form: [this.project_output.tenure_security_form ? this.project_output.tenure_security_form : ''],
            territory: [this.project_output.territory ? this.project_output.territory : ''],
            hectares: [this.project_output.hectares ? this.project_output.hectares : '0'],
            // B
            livelihood: [this.project_output.livelihood ? this.project_output.livelihood : '', [Validators.required]],
            individual_income: [this.project_output.individual_income ? this.project_output.individual_income : '', [Validators.required]],
            household_income: [this.project_output.household_income ? this.project_output.household_income : '', [Validators.required]],
            individual: [this.project_output.individual ? this.project_output.individual : '', [Validators.required]],
            household: [this.project_output.household ? this.project_output.household : '', [Validators.required]],
            // C
            disability_rights: [this.project_output.disability_rights ? this.project_output.disability_rights : 'yes', [Validators.required]],
            intervention_type: [this.project_output.intervention_type ? this.project_output.intervention_type : '', [Validators.required]]
        });
    }

    get f() {
        return this.form.controls;
    }

    fetchObjectiveResult() {
        this.projectService.fetchProjectObjectiveResults({ pk: this.project?.pk as number }).subscribe({
            next: (res: any) => {
                this.objectives = res.data.filter((output: any) => output.type == 'objective');
                this.results = res.data.filter((output: any) => output.type == 'result');
            },
            error: (err: any) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching data. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    fetchOutput() {
        this.projectService.fetchProjectOutput({ pk: this.project?.pk as number }).subscribe({
            next: (res: any) => {
                this.project_output = res;
                this.form.get('tenure_security_form')?.patchValue(res?.tenure_security_form);
                this.form.get('territory')?.patchValue(res?.territory);
                this.form.get('hectares')?.patchValue(res?.hectares);
                this.form.get('livelihood')?.patchValue(res?.livelihood);
                this.form.get('individual_income')?.patchValue(res?.individual_income);
                this.form.get('individual_income')?.patchValue(res?.individual_income);
                this.form.get('household_income')?.patchValue(res?.household_income);
                this.form.get('individual')?.patchValue(res?.individual);
                this.form.get('household')?.patchValue(res?.household);
                this.form.get('disability_rights')?.patchValue(res?.disability_rights ? 'yes' : 'no');
                this.form.get('intervention_type')?.patchValue(res?.intervention_type);
            },
            error: (err: any) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching data. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    save(type: string) {
        if (this.output[type].content.replace(/\s/g, '') !== '' && this.output[type].commentor.replace(/\s/g, '') !== '') {
            this.output[type].project_pk = this.project?.pk;
            this.output[type].type = type;
            this.projectService.saveProjectObjectiveResults({ pk: this.project?.pk, data: this.output[type] }).subscribe({
                next: (res: any) => {
                    this.output[type].content = '';
                    this.output[type].commentor = '';
                    this.fetchObjectiveResult();
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching data. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
        }
    }

    edit(i: number, type: string) {
        if (type == 'objective') {
            this.objectives[i].editable = true;
            this.editable[type] = this.objectives[i];
        }
        if (type == 'result') {
            this.results[i].editable = true;
            this.editable[type] = this.results[i];
        }
    }

    update(i: number, type: string) {
        let output: any = {};
        if (type == 'objective') {
            this.objectives[i].editable = false;
            output = this.objectives[i];
        }
        if (type == 'result') {
            this.results[i].editable = false;
            output = this.results[i];
        }

        if (output.content.replace(/\s/g, '') !== '' && output.commentor.replace(/\s/g, '') !== '') {
            this.projectService.saveProjectObjectiveResults({ pk: this.project?.pk, data: output }).subscribe({
                next: (res: any) => {
                    this.fetchObjectiveResult();
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching data. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
        }
    }

    delete(i: number, type: string) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this?</strong>',
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
                let output: any = {};
                if (type == 'objective') {
                    output = this.objectives[i];
                }
                else {
                    output = this.results[i];
                }

                output.archived = true;
                this.projectService.saveProjectObjectiveResults({ pk: this.project?.pk, data: output }).subscribe({
                    next: (res: any) => {
                        this.fetchObjectiveResult();
                    },
                    error: (err: any) => {
                        const { statusCode, errorMessage } = extractErrorMessage(err);
                        this.toastr.error(
                            `An error occurred. ${statusCode} ${errorMessage} Please try again.`,
                            'ERROR!'
                        );
                    },
                });
            }
        );
    }

    tenure_security_toggle(ev: any) {
        this.disable_tenure_security = !this.disable_tenure_security;
        if (this.form.value.tenure_security == 'yes') {
            this.form.get('tenure_security_form')?.enable();
            this.form.get('territory')?.enable();
            this.form.get('hectares')?.enable();
        }
        else {
            console.log('disabling...');
            // this.form.get('tenure_security_form')?.disable();
            this.form.controls['tenure_security_form'].disable();
            this.form.get('territory')?.disable();
            this.form.get('hectares')?.disable();
        }

        this.cdr.detectChanges();
    }

    onSubmit() {
        this.submitted = true;
        if (!this.form.invalid) {
            this.projectService.saveProjectOutput({ pk: this.project?.pk, data: this.form.value }).subscribe({
                next: (res: any) => {
                    this.fetchObjectiveResult();
                    this.submitted = false;
                    this.toastr.success('Project Output has been successfully saved.', 'SUCCESS!');
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
        }
    }
}
