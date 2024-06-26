import { ProjectService } from 'src/app/services/project.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Project } from 'src/app/interfaces/_project.interface';
import { ToastrService } from 'ngx-toastr';
import { ProjectBeneficiary } from 'src/app/interfaces/_application.interface';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import * as _ from '../../../../../utilities/globals';

export type OnHiddenData = {
    isSaved: boolean;
    data: ProjectBeneficiary[];
};

type ProjectBeneficiaryKey = keyof ProjectBeneficiary;

@Component({
    selector: 'app-project-beneficiary-modal',
    templateUrl: './project-beneficiary-modal.component.html',
    styleUrls: ['./project-beneficiary-modal.component.scss'],
})
export class ProjectBeneficiaryModalComponent implements OnInit {
    loading = true;
    submitted = false;
    processing = false;
    project: Project | null = null;
    projectBeneficiary: ProjectBeneficiary[] = [];
    editableRow: ProjectBeneficiary = {};
    form: FormGroup;
    isSaved: boolean = false;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private projectService: ProjectService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef
    ) {
        this.project = (modalService?.config?.initialState as any)?.project;
        this.projectBeneficiary = (modalService?.config?.initialState as any)?.projectBeneficiary;
    }

    ngOnInit() {
        this.setForm();
    }

    getTotal(data: { women_count: number; young_women_count: number; men_count: number; young_men_count: number }) {
        return data?.young_men_count + data?.young_women_count + data?.women_count + data?.men_count;
    }

    validValue(item: ProjectBeneficiary, projectBeneficiaryKeys: ProjectBeneficiaryKey[]) {
        let totalValue = 0;
        projectBeneficiaryKeys?.forEach((key) => {
            const value = item[key];
            if (typeof value === 'number') {
                totalValue += value;
            }
        });
        return totalValue > 0;
    }

    getListOfProjectBeneficiary(type: 'normal' | 'diffable' | 'other_vulnerable_sector') {
        switch (type) {
            case 'normal':
                return this.projectBeneficiary.filter((item) =>
                    this.validValue(item, ['men_count', 'women_count', 'young_men_count', 'young_women_count'])
                );
            case 'diffable':
                return this.projectBeneficiary.filter((item) =>
                    this.validValue(item, [
                        'men_diffable_count',
                        'women_diffable_count',
                        'young_men_diffable_count',
                        'young_women_diffable_count',
                    ])
                );
                case 'other_vulnerable_sector':
                    return this.projectBeneficiary.filter((item) =>
                        this.validValue(item, [
                            'men_other_vulnerable_sector_count',
                            'women_other_vulnerable_sector_count',
                            'young_men_other_vulnerable_sector_count',
                            'young_women_other_vulnerable_sector_count',
                        ])
                    );
            default:
                return [];
        }
    }

    setForm() {
        this.form = this.formBuilder.group({
            women_count: [0],
            young_women_count: [0],
            men_count: [0],
            young_men_count: [0],
            women_diffable_count: [0],
            young_women_diffable_count: [0],
            men_diffable_count: [0],
            young_men_diffable_count: [0],
            men_other_vulnerable_sector_count: [0],
            young_men_other_vulnerable_sector_count: [0],
            women_other_vulnerable_sector_count: [0],
            young_women_other_vulnerable_sector_count: [0],
        });
    }

    modifyList(list: ProjectBeneficiary[], data: ProjectBeneficiary) {
        const existing = list.find((item) => item.pk === data.pk);
        if (existing) {
            return list.map((item) => {
                if (item.pk === existing.pk) {
                    item = data;
                }
                return {
                    ...item,
                };
            });
        } else {
            return [...list, data];
        }
    }

    saveFormValue(value: ProjectBeneficiary) {
        this.projectService
            .saveProjectBeneficiary({
                project_pk: this.project?.pk,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res.data;
                    const status = res.status;
                    if (status) {
                        this.setForm();
                        this.projectBeneficiary = this.modifyList(this.projectBeneficiary, data);
                        this.cdr.detectChanges();
                        this.isSaved = true;
                        this.toastr.success('Project Beneficiary has been successfully saved', 'SUCCESS!');
                        // always resets row value
                        this.editableRow = {};
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Project Beneficiary. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Project Beneficiary. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    deleteForm(projectBeneficiaryPk: number) {
        this.projectService
            .deleteProjectBeneficiary({
                project_pk: this.project?.pk as number,
                project_beneficiary_pk: projectBeneficiaryPk,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    if (status) {
                        this.projectBeneficiary = this.projectBeneficiary.filter(
                            (beneficiary) => beneficiary?.pk !== projectBeneficiaryPk
                        );
                        this.isSaved = true;
                    } else {
                        this.toastr.error(
                            `An error occurred while deleting Project Beneficiary. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while deleting Project Beneficiary. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    handleAdd(projectBeneficiaryKeys: ProjectBeneficiaryKey[]) {
        this.submitted = true;
        this.processing = true;
        const { value } = this.form;
        const valid = this.validValue(value, projectBeneficiaryKeys);
        if (valid) {
            this.saveFormValue(value);
        } else {
            this.toastr.warning(`Values cannot be less than Zero(0).`, 'WARNING!');
        }
    }

    handleEdit(item: ProjectBeneficiary) {
        this.editableRow = {
            ...item,
        };
    }

    handleSaveRow(projectBeneficiaryKeys: ProjectBeneficiaryKey[]) {
        const valid = this.validValue(this.editableRow, projectBeneficiaryKeys);
        if (this.editableRow && valid) {
            this.saveFormValue(this.editableRow);
        } else {
            this.toastr.warning(`Values cannot be less than Zero(0).`, 'WARNING!');
        }
    }

    handleDelete(projectBeneficiaryPk?: number) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this beneficiary record?</strong>',
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
                this.deleteForm(projectBeneficiaryPk as number);
            }
        );
    }

    handleClose() {
        this.bsModalRef.hide();
        this.bsModalRef.onHidden?.next({
            isSaved: this.isSaved,
            data: this.projectBeneficiary,
        } as OnHiddenData);
    }
}
