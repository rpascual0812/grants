import { ProjectSite } from './../../../../../../interfaces/_project.interface';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ChangeFieldEventEmitter } from 'src/app/components/select/select.component';
import { Country, Province } from 'src/app/interfaces/_application.interface';
import { Project } from 'src/app/interfaces/_project.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { extractErrorMessage, getDurationOpts } from 'src/app/utilities/application.utils';
import { OnHiddenData } from '../../../grant-view.component';
import { ProjectService } from 'src/app/services/project.service';

type SelectItem = {
    pk?: number;
    province_code?: number;
    name: string;
};

type ProvinceOpt = {
    country_pk?: number;
    province_code?: number;
    name?: string;
};

@Component({
    selector: 'app-proj-info-view',
    templateUrl: './proj-info-view.component.html',
    styleUrls: ['./proj-info-view.component.scss'],
})
export class ProjInfoViewComponent implements OnInit {
    @Input() project: Project | null;
    @Input() countries: Country[] = [];
    @Input() provinces: Province[] = [];
    @Input() projectSite: ProjectSite[] = [];

    isSaved = false;
    processing = false;
    form: FormGroup;
    submitted = false;
    durationOpts: string[] = [];

    provinceOpts: ProvinceOpt[] = [];
    projectLoc: FormArray;
    projSiteForm: FormArray;

    SELECT_PROVINCE_KEY_PREFIX = 'province_';
    SELECT_COUNTRY_KEY_PREFIX = 'country_';
    selectChangeFieldEventEmitter = {
        durationSelectChangeFieldEventEmitter: new EventEmitter<ChangeFieldEventEmitter>(),
        countrySelectChangeFieldEventEmitter: new EventEmitter<ChangeFieldEventEmitter>(),
        provinceSelectChangeFieldEventEmitter: new EventEmitter<ChangeFieldEventEmitter>(),
    };

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private projectService: ProjectService,
        private toastr: ToastrService,
        public documentUploaderRef: BsModalRef
    ) { }

    ngOnInit() {
        this.provinceOpts = this.provinces?.map((item: any) => ({
            country_pk: item?.country_pk,
            province_code: item?.province_code,
            name: item?.name,
        }));
        this.setForm();
        this.durationOpts = getDurationOpts();
    }

    get f() {
        return this.form.controls;
    }

    get formProjLocations() {
        return <FormArray>this.form.get('project_location');
    }

    get formProjSite() {
        return <FormArray>this.form.get('project_site');
    }

    setForm() {
        const currentProject = this.project;
        const partnerOrg = currentProject?.partner?.organization;
        const project = currentProject;
        this.form = this.formBuilder.group({
            title: [project?.title ?? '', Validators.required],
            duration: [project?.duration ?? '', Validators.required],
            background: [project?.background ?? '', Validators.required],
            objective: [project?.objective ?? '', Validators.required],
            expected_output: [project?.expected_output ?? '', Validators.required],
            how_will_affect: [project?.how_will_affect ?? '', Validators.required],
            project_website: [partnerOrg?.project_website ?? ''],
            project_location: this.formBuilder.array([], [Validators.required]),
            project_site: this.formBuilder.array([]),
        });
        this.initialProjLocations();
        this.initialProjSite();
    }

    initialProjSite() {
        this.projSiteForm = this.form.get('project_site') as FormArray;
        this.projectSite.forEach((item) => {
            this.projSiteForm.push(this.createFormProjSite(item?.pk, item?.site));
        });
    }

    initialProjLocations() {
        this.projectLoc = this.form.get('project_location') as FormArray;
        const currentProject = this.project;
        const projLoc = currentProject?.project_location;
        const currentProjLoc = projLoc ?? [];
        currentProjLoc.forEach((projLoc, idx) => {
            this.projectLoc.push(this.createFormProjLocations(projLoc?.pk, projLoc.country_pk, projLoc.province_code));
            setTimeout(() => {
                this.selectChangeFieldEventEmitter.provinceSelectChangeFieldEventEmitter.emit({
                    selectedItems: this.provinceOpts?.filter(
                        (province) => province.province_code === projLoc.province_code
                    ),
                    arr: this.getProvinceOpts(projLoc.country_pk as number),
                    key: `${this.SELECT_PROVINCE_KEY_PREFIX}${idx.toString()}`,
                });
            }, 500);
        });
    }

    createFormProjLocations(projLocPk?: number, countryPk?: number, provinceCode?: number): FormGroup {
        return this.formBuilder.group({
            pk: [projLocPk ?? ''],
            country_pk: [countryPk ?? '', Validators.required],
            province_code: [provinceCode ?? '', Validators.required],
        });
    }

    createFormProjSite(projSitePk?: number, site?: string): FormGroup {
        return this.formBuilder.group({
            pk: [projSitePk ?? ''],
            site: [site ?? '', Validators.required],
        });
    }

    getProvinceOpts(countryPk: number) {
        return this.provinceOpts.filter((item) => item.country_pk === countryPk);
    }

    onAddProjLoc() {
        this.projectLoc = this.form.get('project_location') as FormArray;
        this.projectLoc.push(this.createFormProjLocations());
    }

    onAddProjSite() {
        this.projSiteForm = this.form.get('project_site') as FormArray;
        this.projSiteForm.push(this.createFormProjSite());
    }

    onModifyProjLoc(
        item: SelectItem[],
        listItemKey: 'pk' | 'province_code',
        key: 'country_pk' | 'province_code',
        idx: number
    ) {
        const project = this.project;
        const projLoc = project?.project_location?.at(idx);
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.[listItemKey ?? ''] ?? '';
        if (key === 'country_pk') {
            this.projectLoc.controls.at(idx)?.setValue({
                pk: projLoc?.pk ?? '',
                country_pk: pk,
                province_code: '',
            });

            this.selectChangeFieldEventEmitter.provinceSelectChangeFieldEventEmitter.emit({
                arr: this.getProvinceOpts(pk as number),
                selectedItems: [],
                key: `${this.SELECT_PROVINCE_KEY_PREFIX}${idx.toString()}`,
            });
        } else {
            this.projectLoc.controls.at(idx)?.setValue({
                pk: projLoc?.pk ?? '',
                country_pk: this.projectLoc.at(idx).get('country_pk')?.value,
                province_code: pk,
            });
        }
    }

    onDelProjLoc(idx: number) {
        const project = this.project;
        const projectPk = project?.pk ?? null;
        const tempLocPk = this.projectLoc.at(idx).get('pk')?.value;
        const locationPk = typeof tempLocPk === 'string' || !tempLocPk ? null : tempLocPk;
        if (projectPk && locationPk) {
            this.applicationService
                .deleteAppProjLoc({
                    projectPk,
                    locationPk,
                })
                .subscribe({
                    next: (res: any) => {
                        const status = res?.status;
                        if (status) {
                            this.projectLoc.removeAt(idx);
                            const projectLoc = this.project?.project_location?.filter(
                                (location) => location.pk !== locationPk
                            );
                            this.project = {
                                ...this.project,
                                project_location: projectLoc,
                            } as Project;
                            this.isSaved = true;
                        } else {
                            this.toastr.error(
                                `An error occurred while deleting Project Location. Please try again.`,
                                'ERROR!'
                            );
                        }
                    },
                    error: (err) => {
                        const { statusCode, errorMessage } = extractErrorMessage(err);
                        this.toastr.error(
                            `An error occurred while deleting Project Location. ${statusCode} ${errorMessage} Please try again.`,
                            'ERROR!'
                        );
                    },
                });
        } else {
            this.projectLoc.removeAt(idx);
        }
    }

    onDelProjSite(idx: number) {
        const projectPk = this.project?.pk;
        const tempSitePk = this.projSiteForm.at(idx).get('pk')?.value;
        const sitePk = typeof tempSitePk === 'string' || !tempSitePk ? null : tempSitePk;
        if (projectPk && sitePk) {
            this.projectService
                .deleteProjectSite({
                    project_pk: projectPk,
                    project_site_pk: sitePk,
                })
                .subscribe({
                    next: (res: any) => {
                        const status = res?.status;
                        if (status) {
                            this.projSiteForm.removeAt(idx);
                            const projectSite = this.projectSite?.filter((site) => site.pk !== sitePk);
                            this.projectSite = projectSite;
                            this.isSaved = true;
                        } else {
                            this.toastr.error(
                                `An error occurred while deleting Project Site. Please try again.`,
                                'ERROR!'
                            );
                        }
                    },
                    error: (err) => {
                        const { statusCode, errorMessage } = extractErrorMessage(err);
                        this.toastr.error(
                            `An error occurred while deleting Project Site. ${statusCode} ${errorMessage} Please try again.`,
                            'ERROR!'
                        );
                    },
                });
        } else {
            this.projSiteForm.removeAt(idx);
        }
    }

    isNotValidKeyNumber(countryPk: number) {
        return typeof countryPk !== 'number';
    }

    onChangeSelectedItem(item: SelectItem[] | string[], key: string) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.pk ?? '';
        if (pk) {
            this.form.controls[key].setValue(pk);
        } else {
            this.form.controls[key].setValue(extractedItem ?? '');
        }
    }

    handleClose() {
        this.processChanges();
        this.bsModalRef.hide();
    }

    saveProjectInfo() {
        const project = this.project;
        const { value } = this.form;
        this.applicationService
            .saveApplicationProject({
                pk: project?.pk,
                application_pk: this.project?.application?.pk,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res?.status;
                    if (status) {
                        this.project = {
                            ...this.project,
                            ...data,
                        };
                        this.toastr.success('Project Information has been successfully saved', 'SUCCESS!');
                        this.isSaved = true;
                        this.savePartnerOrg();
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Project Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Project Information. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    savePartnerOrg() {
        const { value } = this.form;
        this.applicationService
            .saveApplicationPartnerOrg({
                partner_id: this.project?.partner?.partner_id,
                partner_pk: this.project?.partner?.pk,
                organization_pk: this.project?.partner?.organization?.pk,
                project_website: value?.project_website,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res?.status;
                    if (status) {
                        this.toastr.success('Organization has been successfully saved', 'SUCCESS!');
                        this.project = {
                            ...this.project,
                            partner: {
                                ...this.project?.partner,
                                organization: {
                                    ...this.project?.partner?.organization,
                                    ...data,
                                },
                            },
                        } as Project;
                        this.isSaved = true;
                        this.saveProjectSite();
                    } else {
                        this.toastr.error(`An error occurred while saving Organization. Please try again.`, 'ERROR!');
                    }

                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Organization. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    saveProjectSite() {
        const { value } = this.form;
        const projectSite = value.project_site;
        this.projectService
            .saveProjectSite({
                project_pk: this.project?.pk,
                project_site: projectSite,
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.toastr.success('Project Site has been successfully saved', 'SUCCESS!');
                        this.projectSite = data?.project_site;
                        this.isSaved = true;
                        this.handleClose();
                    } else {
                        this.toastr.error(`An error occurred while saving Project Site. Please try again.`, 'ERROR!');
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Project Site. ${statusCode} ${errorMessage} Please try again.`,
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
            this.processing = true;
            this.saveProjectInfo();
        }
    }

    processChanges() {
        this.bsModalRef.onHidden?.next({
            isSaved: this.isSaved,
            data: {
                project: this.project,
                projectSite: this.projectSite,
            },
        } as OnHiddenData);
    }
}
