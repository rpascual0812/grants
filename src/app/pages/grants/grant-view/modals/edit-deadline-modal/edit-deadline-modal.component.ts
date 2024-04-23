import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProjectFunding } from 'src/app/interfaces/_project.interface';
import { ProjectService } from 'src/app/services/project.service';
import { onHiddenDataFundingRelease } from '../funding-release-tranche-modal/funding-release-tranche-modal.component';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

const parseFormDate = (date: Date) => {
    return formatDate(date, 'yyyy-MM-dd', 'en');
};

@Component({
    selector: 'app-edit-deadline-modal',
    templateUrl: './edit-deadline-modal.component.html',
    styleUrls: ['./edit-deadline-modal.component.scss'],
})
export class EditDeadlineModalComponent implements OnInit {
    processing = false;
    funding: ProjectFunding | null = null;
    submitted: boolean = false;
    form: FormGroup;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private projectService: ProjectService,
        private modalService: BsModalService,
        private toastr: ToastrService
    ) {
        this.funding = (modalService?.config?.initialState as any)?.funding;
    }

    ngOnInit() {
      this.setForm()
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        this.form = this.formBuilder.group({
            report_due_date: [
                this.funding?.report_due_date ? parseFormDate(this.funding?.report_due_date ?? '') : '',
                Validators.required,
            ],
        });
    }

    saveFormValue() {
        const { value } = this.form;

        this.projectService
            .saveProjectFunding({
                project_pk: this.funding?.project_pk,
                pk: this.funding?.pk,
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
                        this.toastr.success('Deadline has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(`An error occurred while saving Deadline. Please try again.`, 'ERROR!');
                    }
                    this.processing = false;
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Deadline. ${statusCode} ${errorMessage} Please try again.`,
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
