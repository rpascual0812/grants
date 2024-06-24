import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PartnerService } from 'src/app/services/partner.service';
import { OnHiddenData } from '../../../grant-view.component';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { Project } from 'src/app/interfaces/_project.interface';
import { PartnerAssessment, ProjectAssessment } from 'src/app/interfaces/_application.interface';
import { ProjectService } from 'src/app/services/project.service';

type SelectItem = {
    pk: number;
    name: string;
};

@Component({
    selector: 'app-assessment-view',
    templateUrl: './assessment-view.component.html',
    styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit {
    @Input() project: Project | null = null;
    @Input() projectAssessment: ProjectAssessment | null = null;
    processing = false;
    submitted = false;
    form: FormGroup;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private projectService: ProjectService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const assessment = this.projectAssessment;
        this.form = this.formBuilder.group({
            // donor_pk: [assessment?.donor_pk ?? '', Validators?.required],
            message: [assessment?.message ?? '', Validators?.required],
        });
    }

    saveFormValue() {
        this.processing = true;
        const { value } = this.form;

        this.projectService
            .saveProjectAssessment({
                project_pk: this.projectAssessment?.project_pk,
                pk: this.projectAssessment?.pk,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res?.status;
                    if (status) {
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                project: this.project,
                                projectAssessment: {
                                    ...data,
                                },
                            },
                        } as OnHiddenData);
                        this.bsModalRef.hide();
                        this.toastr.success('Assessment has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(`An error occurred while saving Assessment. Please try again.`, 'ERROR!');
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Assessment. ${statusCode} ${errorMessage} Please try again.`,
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
            this.saveFormValue();
        }
    }

    handleClose() {
        this.bsModalRef.hide();
    }

    // onChangeSelectedItem(item: SelectItem[] | string[], key: string) {
    //     const extractedItem = item?.at(0);
    //     const pk = (extractedItem as SelectItem)?.pk ?? '';
    //     this.form.get('donor_pk')?.patchValue(pk);
    // }
}
