import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
    Project,
    ProjectCapDevKnowledge,
    ProjectCapDevObserve,
    ProjectCapDevSkill,
} from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

type EditableRow = {
    capDevKnowledgeRow: number | null;
    capDevSkillRow: number | null;
    capDevObserveRow: number | null;
};

type EditableRowKey = keyof EditableRow;

@Component({
    selector: 'app-capdev',
    templateUrl: './capdev.component.html',
    styleUrls: ['./capdev.component.scss'],
})
export class CapdevComponent implements OnInit {
    loading = {
        knowledge: true,
        skill: true,
        observe: true,
    };

    processing = {
        knowledge: false,
        skill: false,
        observe: false,
    };

    project: Project | null = null;
    projectCapDevKnowledge: ProjectCapDevKnowledge[] = [];
    projectCapDevSkill: ProjectCapDevSkill[] = [];
    projectCapDevObserve: ProjectCapDevObserve[] = [];

    editableRow: EditableRow = {
        capDevKnowledgeRow: null,
        capDevSkillRow: null,
        capDevObserveRow: null,
    };

    capDevKnowledgeForm: ProjectCapDevKnowledge = {
        knowledge: '',
        instruction: '',
        remarks: '',
    };

    capDevKnowledgeFormRow: ProjectCapDevKnowledge = {
        knowledge: '',
        instruction: '',
        remarks: '',
    };

    capDevSkillForm: ProjectCapDevSkill = {
        skill_gained: '',
        instruction: '',
        skill: '',
        remarks: '',
    };

    capDevSkillFormRow: ProjectCapDevSkill = {
        skill_gained: '',
        instruction: '',
        skill: '',
        remarks: '',
    };

    capDevObserveForm: ProjectCapDevObserve = {
        observed: '',
    };

    capDevObserveFormRow: ProjectCapDevObserve = {
        observed: '',
    };

    grantSignalService = inject(GrantSignalService);

    constructor(
        private projectService: ProjectService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.project = this.grantSignalService.project();
        this.fetchKnowledge();
        this.fetchSkill();
        this.fetchObserve();
    }

    fetchKnowledge() {
        this.loading.knowledge = true;
        this.projectService
            .fetchProjectCapDevKnowledge({
                project_pk: this.project?.pk as number,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.projectCapDevKnowledge = data ?? [];
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Project CapDev Knowledge. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.loading.knowledge = false;
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Project CapDev Knowledge. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loading.knowledge = false;
                },
            });
    }

    fetchSkill() {
        this.loading.skill = true;
        this.projectService
            .fetchProjectCapDevSkill({
                project_pk: this.project?.pk as number,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.projectCapDevSkill = data ?? [];
                    } else {
                        this.toastr.error(
                            `An error occurred while fetching Project CapDev Skill. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.loading.skill = false;
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Project CapDev Skill. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loading.skill = false;
                },
            });
    }

    fetchObserve() {
        this.loading.observe = true;
        this.projectService
            .fetchProjectCapDevObserve({
                project_pk: this.project?.pk as number,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.projectCapDevObserve = data ?? [];
                    } else {
                        this.toastr.error(
                            `An error occurred fetching Project CapDev Observe. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.loading.observe = false;
                },
                error: (err: any) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while fetching Project CapDev Observe. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.loading.observe = false;
                },
            });
    }

    modifyList<T extends ProjectCapDevKnowledge | ProjectCapDevObserve | ProjectCapDevSkill>(list: T[], data: T) {
        const existing = list.find((item) => item?.pk === data?.pk);
        if (existing) {
            list = list.map((item) => {
                if (item?.pk === existing?.pk) {
                    item = data;
                }
                return {
                    ...item,
                };
            });
        } else {
            list = [...list, data];
        }
        return list;
    }

    removeItemFromList<T extends ProjectCapDevKnowledge | ProjectCapDevObserve | ProjectCapDevSkill>(
        list: T[],
        data: T
    ) {
        const existing = list.find((item) => item?.pk === data?.pk);
        return list.filter((item) => item.pk !== existing?.pk);
    }

    saveKnowledge(projectCapDevKnowledge: ProjectCapDevKnowledge) {
        this.processing.knowledge = true;
        this.projectService
            .saveProjectCapDevKnowledge({
                project_pk: this.project?.pk as number,
                ...projectCapDevKnowledge,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.projectCapDevKnowledge = this.modifyList(this.projectCapDevKnowledge, data);
                        this.cdr.detectChanges();
                        this.toastr.success('Project CapDev Knowledge has been successfully saved', 'SUCCESS!');
                        // reset fields
                        this.capDevKnowledgeForm.knowledge = '';
                        this.capDevKnowledgeForm.instruction = '';
                        this.capDevKnowledgeForm.remarks = '';
                    } else {
                        this.toastr.error(
                            `An error occurred saving Project CapDev Knowledge. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing.knowledge = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Project CapDev Knowledge. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing.knowledge = false;
                },
            });
    }

    deleteKnowledge(projectCapDevKnowledge: ProjectCapDevKnowledge) {
        this.projectService
            .deleteProjectCapKnowledge({
                project_pk: this.project?.pk as number,
                pk: projectCapDevKnowledge?.pk as number,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    if (status) {
                        this.projectCapDevKnowledge = this.removeItemFromList(
                            this.projectCapDevKnowledge,
                            projectCapDevKnowledge
                        );
                        this.cdr.detectChanges();
                        this.toastr.success('Project CapDev Knowledge has been successfully deleted', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred deleting Project CapDev Knowledge. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing.knowledge = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while deleting Project CapDev Knowledge. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing.knowledge = false;
                },
            });
    }

    handleSaveKnowledge(knowledgeForm: ProjectCapDevKnowledge, key?: EditableRowKey) {
        const fieldKeys = ['knowledge', 'instruction', 'remarks'];
        const tmpVal = Object.keys(knowledgeForm).map((key) => {
            if (fieldKeys.includes(key)) {
                return {
                    key,
                    value: knowledgeForm[key as keyof typeof knowledgeForm],
                };
            }
            return null;
        });
        const missingField = tmpVal.find((item) => item && typeof item.value === 'string' && item.value.trim() === '');
        if (missingField) {
            this.toastr.error(`Unable to save ${missingField.key} is required.`, 'ERROR!');
        } else {
            this.saveKnowledge(knowledgeForm);
            if (key) {
                this.editableRow[key] = null;
            }
        }
    }

    saveSkill(projectCapDevSkill: ProjectCapDevSkill) {
        this.processing.skill = true;
        this.projectService
            .saveProjectCapDevSkill({
                project_pk: this.project?.pk as number,
                ...projectCapDevSkill,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.projectCapDevSkill = this.modifyList(this.projectCapDevSkill, data);
                        this.cdr.detectChanges();
                        this.toastr.success('Project CapDev Skill has been successfully saved', 'SUCCESS!');
                        // reset fields
                        this.capDevSkillForm.skill_gained = '';
                        this.capDevSkillForm.skill = '';
                        this.capDevSkillForm.instruction = '';
                        this.capDevSkillForm.remarks = '';
                    } else {
                        this.toastr.error(`An error occurred saving Project CapDev Skill. Please try again.`, 'ERROR!');
                    }
                    this.processing.skill = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Project CapDev Skill. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing.skill = false;
                },
            });
    }

    deleteSkill(projectCapDevSkill: ProjectCapDevSkill) {
        this.projectService
            .deleteProjectCapDevSkill({
                project_pk: this.project?.pk as number,
                pk: projectCapDevSkill?.pk as number,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    if (status) {
                        this.projectCapDevSkill = this.removeItemFromList(this.projectCapDevSkill, projectCapDevSkill);
                        this.cdr.detectChanges();
                        this.toastr.success('Project CapDev Skill has been successfully deleted', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred deleting Project CapDev Skill. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing.skill = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while deleting Project CapDev Skill. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing.skill = false;
                },
            });
    }

    handleSaveSkill(skillForm: ProjectCapDevSkill, key?: EditableRowKey) {
        const fieldKeys = ['skill_gained', 'skill', 'instruction', 'remarks'];
        const tmpVal = Object.keys(skillForm).map((key) => {
            if (fieldKeys.includes(key)) {
                return {
                    key,
                    value: skillForm[key as keyof typeof skillForm],
                };
            }
            return null;
        });
        const missingField = tmpVal.find((item) => item && typeof item.value === 'string' && item.value.trim() === '');
        if (missingField) {
            this.toastr.error(`Unable to save ${missingField.key} is required.`, 'ERROR!');
        } else {
            this.saveSkill(skillForm);
            if (key) {
                this.editableRow[key] = null;
            }
        }
    }

    saveObserve(projectCapDevObserve: ProjectCapDevObserve) {
        this.processing.observe = true;
        this.projectService
            .saveProjectCapDevObserve({
                project_pk: this.project?.pk as number,
                ...projectCapDevObserve,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.projectCapDevObserve = this.modifyList(this.projectCapDevObserve, data);
                        this.cdr.detectChanges();
                        this.toastr.success('Project CapDev Observe has been successfully saved', 'SUCCESS!');
                        // reset fields
                        this.capDevObserveForm.observed = '';
                    } else {
                        this.toastr.error(
                            `An error occurred saving Project CapDev Observe. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing.skill = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Project CapDev Observe. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing.skill = false;
                },
            });
    }

    deleteObserve(projectCapDevObserve: ProjectCapDevSkill) {
        this.processing.observe = true;
        this.projectService
            .deleteProjectCapDevObserve({
                project_pk: this.project?.pk as number,
                pk: projectCapDevObserve?.pk as number,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    if (status) {
                        this.projectCapDevObserve = this.removeItemFromList(
                            this.projectCapDevObserve,
                            projectCapDevObserve
                        );
                        this.cdr.detectChanges();
                        this.toastr.success('Project CapDev Observe has been successfully deleted', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred deleting Project CapDev Observe. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing.observe = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while deleting Project CapDev Observe. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing.observe = false;
                },
            });
    }

    handleSaveObserve(observeForm: ProjectCapDevObserve, key?: EditableRowKey) {
        const fieldKeys = ['observed'];
        const tmpVal = Object.keys(observeForm).map((key) => {
            if (fieldKeys.includes(key)) {
                return {
                    key,
                    value: observeForm[key as keyof typeof observeForm],
                };
            }
            return null;
        });
        const missingField = tmpVal.find((item) => item && typeof item.value === 'string' && item.value.trim() === '');
        if (missingField) {
            this.toastr.error(`Unable to save ${missingField.key} is required.`, 'ERROR!');
        } else {
            this.saveObserve(observeForm);
            if (key) {
                this.editableRow[key] = null;
            }
        }
    }

    handleEdit(key: EditableRowKey, idx: number, pk?: number) {
        this.editableRow[key] = idx;
        if (key === 'capDevKnowledgeRow') {
            const item = this.projectCapDevKnowledge?.find((item) => item.pk === pk);
            this.capDevKnowledgeFormRow.pk = item?.pk;
            this.capDevKnowledgeFormRow.instruction = item?.instruction ?? '';
            this.capDevKnowledgeFormRow.remarks = item?.remarks ?? '';
            this.capDevKnowledgeFormRow.knowledge = item?.knowledge ?? '';
        }

        if (key === 'capDevSkillRow') {
            const item = this.projectCapDevSkill?.find((item) => item.pk === pk);
            this.capDevSkillFormRow.pk = item?.pk;
            this.capDevSkillFormRow.instruction = item?.instruction ?? '';
            this.capDevSkillFormRow.remarks = item?.remarks ?? '';
            this.capDevSkillFormRow.skill = item?.skill ?? '';
            this.capDevSkillFormRow.skill_gained = item?.skill_gained ?? '';
        }

        if (key === 'capDevObserveRow') {
            const item = this.projectCapDevObserve?.find((item) => item.pk === pk);
            this.capDevObserveFormRow.pk = item?.pk;
            this.capDevObserveFormRow.observed = item?.observed ?? '';
        }
    }

    handleSavePerRow(key: EditableRowKey) {
        if (key === 'capDevKnowledgeRow') {
            this.handleSaveKnowledge(this.capDevKnowledgeFormRow);
            this.editableRow[key] = null;
        }

        if (key === 'capDevSkillRow') {
            this.handleSaveSkill(this.capDevSkillFormRow);
            this.editableRow[key] = null;
        }

        if (key === 'capDevObserveRow') {
            this.handleSaveObserve(this.capDevObserveFormRow);
            this.editableRow[key] = null;
        }
    }
}
