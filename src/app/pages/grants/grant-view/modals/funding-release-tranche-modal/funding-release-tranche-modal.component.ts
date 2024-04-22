import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProjectFunding, ProjectFundingReport } from 'src/app/interfaces/_project.interface';
import { formatDate } from '@angular/common';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { USD_CURRENCY } from 'src/app/utilities/constants';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import * as _ from '../../../../../utilities/globals';
import { DocumentService } from 'src/app/services/document.service';
import { Document } from 'src/app/interfaces/_application.interface';

export type onHiddenDataFundingRelease = {
    isSaved: boolean;
    data: ProjectFunding | null;
};

export type GroupedFundingReport = {
    [key: string]: ProjectFundingReport[];
};

const parseFormDate = (date: Date) => {
    return formatDate(date, 'yyyy-MM-dd', 'en');
};

const parseGroupedFundingReportAsArr = (groupedFundingReport: GroupedFundingReport) => {
    const arr = Object.keys(groupedFundingReport).map((key) => groupedFundingReport[key]);
    return arr.flat();
};

@Component({
    selector: 'app-funding-release-tranche-modal',
    templateUrl: './funding-release-tranche-modal.component.html',
    styleUrls: ['./funding-release-tranche-modal.component.scss'],
})
export class FundingReleaseTrancheModalComponent implements OnInit {
    processing = false;
    funding: ProjectFunding | null = null;
    submitted: boolean = false;
    form: FormGroup;
    groupedFundingReport: GroupedFundingReport = {};

    attachments: any = {
        bank_receipt: [],
        report_file: [],
    };
    SERVER: string = _.BASE_URL;

    bank_receipt: any = {};
    report_file: any = {};

    grantee_acknowledgement: boolean = false;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private projectService: ProjectService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private documentService: DocumentService
    ) {
        this.funding = (modalService?.config?.initialState as any)?.funding;
    }

    ngOnInit() {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        this.form = this.formBuilder.group({
            title: [this.funding?.title ?? '', Validators.required],
            released_date: [
                this.funding?.released_date ? parseFormDate(this.funding?.released_date ?? '') : '',
                Validators.required,
            ],
            report_due_date: [
                this.funding?.report_due_date ? parseFormDate(this.funding?.report_due_date ?? '') : '',
                Validators.required,
            ],
            released_amount_usd: [this.funding?.released_amount_usd ?? '', Validators.required],
            released_amount_other_currency: [
                this.funding?.released_amount_other_currency ??
                    `${USD_CURRENCY.at(0)?.key} - ${USD_CURRENCY.at(0)?.label}`,
            ],
            grantee_acknowledgement: [null],
        });
        this.initialFundingReportRender();
    }

    initialFundingReportRender() {
        const projFundingReport = this.funding?.project_funding_report ?? [];
        this.groupedFundingReport = projFundingReport.reduce((acc, value) => {
            if (value?.title) {
                (acc[value?.title] = acc[value?.title] || []).push(value);
            }
            return acc;
        }, {} as GroupedFundingReport);
    }

    handleAddFundingReport(params: { title: string; status: string }) {
        const { title, status } = params;
        if (title) {
            (this.groupedFundingReport[title] = this.groupedFundingReport[title] || []).push({
                title,
                status,
                date_created: new Date(),
            });
        }
    }

    handleDelFundingReport(idx: number, key: string) {
        const report = this.groupedFundingReport[key].find((_item, i) => i === idx);
        if (report?.pk && this.funding?.pk) {
            this.projectService
                .deleteProjectFundingReport({
                    project_pk: this.funding?.project_pk,
                    project_funding_pk: this.funding?.pk,
                    project_funding_report_pk: report?.pk,
                })
                .subscribe({
                    next: (res: any) => {
                        const status = res?.status;
                        if (status) {
                            this.groupedFundingReport[key] = this.groupedFundingReport[key].filter(
                                (_item, i) => i !== idx
                            );
                        } else {
                            this.toastr.error(`An error occurred while deleting. Please try again.`, 'ERROR!');
                        }
                    },
                    error: (err: any) => {
                        const { statusCode, errorMessage } = extractErrorMessage(err);
                        this.toastr.error(
                            `An error occurred while saving Tranche. ${statusCode} ${errorMessage} Please try again.`,
                            'ERROR!'
                        );
                    },
                });
        } else {
            this.groupedFundingReport[key] = this.groupedFundingReport[key].filter((_item, i) => i !== idx);
        }
    }

    saveFormValue() {
        const { value } = this.form;
        const projectFundingReport = parseGroupedFundingReportAsArr(this.groupedFundingReport);
        this.projectService
            .saveProjectFunding({
                project_pk: this.funding?.project_pk,
                pk: this.funding?.pk,
                ...value,
                project_funding_report: projectFundingReport,
                released_amount_other: value.released_amount_usd,
                bank_receipt_pk: this.bank_receipt.pk,
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

    uploadFiles(type: string) {
        const initialState: ModalOptions = {
            class: 'modal-lg',
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            if (type == 'bank_receipt') {
                this.bank_receipt = res.file;
                this.attachments.bank_receipt = [res.file];
            } else if (type == 'report') {
                this.report_file = res.file;
                this.attachments.report_file = [res.file];
            }
            this.cdr.detectChanges();
        });
    }

    delete(index: number) {
        this.attachments.splice(index, 1);
        this.form.get('bank_receipt_pk')?.patchValue(null);
    }
}
