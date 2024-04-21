import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PartnerService } from 'src/app/services/partner.service';
import { OnHiddenData } from '../../../grant-view.component';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { Project } from 'src/app/interfaces/_project.interface';
import { PartnerAssessment } from 'src/app/interfaces/_application.interface';

@Component({
    selector: 'app-assessment-view',
    templateUrl: './assessment-view.component.html',
    styleUrls: ['./assessment-view.component.scss'],
})
export class AssessmentViewComponent implements OnInit {
    @Input() project: Project | null = null;
    @Input() partnerAssessment: PartnerAssessment | null = null;
    processing = false;
    submitted = false;
    form: FormGroup;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private partnerService: PartnerService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        console.log(5, this.project, this.partnerAssessment);
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const assessment = this.partnerAssessment;
        this.form = this.formBuilder.group({
            message: [assessment?.message ?? '', Validators?.required],
        });
    }

    saveFormValue() {
        this.processing = true;
        const { value } = this.form;

        this.partnerService
            .savePartnerAssessment({
                partner_pk: this.partnerAssessment?.partner_pk,
                pk: this.partnerAssessment?.pk,
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
                                partnerAssessment: {
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
}
