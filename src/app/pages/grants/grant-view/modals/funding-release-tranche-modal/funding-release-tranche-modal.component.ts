import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/components/modal/modal.service';
import { ProjectFunding } from 'src/app/interfaces/_project.interface';
import { formatDate } from '@angular/common';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

export type onHiddenDataFundingRelease = {
    isSaved: boolean;
    data: ProjectFunding | null;
};

const parseFormDate = (date: Date) => {
    return formatDate(date, 'yyyy-MM-dd', 'en');
};

@Component({
    selector: 'app-funding-release-tranche-modal',
    templateUrl: './funding-release-tranche-modal.component.html',
    styleUrls: ['./funding-release-tranche-modal.component.scss'],
})
export class FundingReleaseTrancheModalComponent implements OnInit {
    processing = false;
    projectFunding: ProjectFunding | null = null;
    submitted: boolean = false;
    form: FormGroup;
    projectFundingReport: FormArray;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private projectService: ProjectService,
        private modalService: BsModalService,
        private toastr: ToastrService
    ) {
        this.projectFunding = (modalService?.config?.initialState as any)?.projectFunding;
    }

    ngOnInit() {
        console.log(this.projectFunding);
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    get formProjFundingReport() {
        return <FormArray>this.form.get('project_funding_report');
    }

    setForm() {
        this.form = this.formBuilder.group({
            title: [this.projectFunding?.title ?? '', Validators.required],
            released_date: [
                this.projectFunding?.released_date ? parseFormDate(this.projectFunding?.released_date ?? '') : '',
                Validators.required,
            ],
            report_due_date: [
                this.projectFunding?.report_due_date ? parseFormDate(this.projectFunding?.report_due_date ?? '') : '',
                Validators.required,
            ],
            released_amount: [this.projectFunding?.released_amount ?? '', Validators.required],
            project_funding_report: this.formBuilder.array([]),
        });
        this.initialProjFundingReport();
    }

    initialProjFundingReport() {
        this.projectFundingReport = this.form.get('project_funding_report') as FormArray;
        const projFundingReport = this.projectFunding?.project_funding_report ?? [];
        projFundingReport.forEach((report) => {
            this.projectFundingReport.push(
                this.createFormProjectFundingReport(
                    report?.title ?? '',
                    report?.status ?? '',
                    (report?.date_created ?? '') as Date,
                    report?.pk
                )
            );
        });
    }

    createFormProjectFundingReport(
        title: string,
        status: string,
        dateCreated?: Date,
        projectFundingReportPk?: number
    ): FormGroup {
        return this.formBuilder.group({
            pk: [projectFundingReportPk ?? ''],
            title: [title, Validators.required],
            date_created: [dateCreated ? parseFormDate(dateCreated) : ''],
            status: [status, Validators.required],
        });
    }

    onChangeSelectOpt(value: string, key: string, idx: number) {
        this.projectFundingReport?.at(idx).get(key)?.setValue(value);
    }

    handleAddFundingReport(params: { title: string; status: string }) {
        this.projectFundingReport.push(this.createFormProjectFundingReport(params?.title, params?.status));
    }

    saveFormValue() {
        const { value } = this.form;
        this.projectService
            .saveProjectFunding({
                project_pk: this.projectFunding?.project_pk,
                pk: this.projectFunding?.pk,
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
                        } as onHiddenDataFundingRelease);
                        this.handleClose();
                        this.toastr.success('Tranche has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(`An error occurred while saving Tranche. Please try again.`, 'ERROR!');
                    }
                    this.processing = false;
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Tranche. ${statusCode} ${errorMessage} Please try again.`,
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
