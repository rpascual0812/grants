import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ChangeFieldEventEmitter } from 'src/app/components/select/select.component';
import { Application, Country, Province } from 'src/app/interfaces/_application.interface';
import { Project } from 'src/app/interfaces/_project.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { extractErrorMessage, getDurationOpts } from 'src/app/utilities/application.utils';
import { OnHiddenData } from '../../../grant-view.component';

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

    processing = false;
    form: FormGroup;
    submitted = false;
    durationOpts: string[] = [];

    provinceOpts: ProvinceOpt[] = [];
    projectLoc: FormArray;

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
        });
        this.initialProjLocations();
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

    getProvinceOpts(countryPk: number) {
        return this.provinceOpts.filter((item) => item.country_pk === countryPk);
    }

    onAddProjLoc() {
        this.projectLoc = this.form.get('project_location') as FormArray;
        this.projectLoc.push(this.createFormProjLocations());
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
                        } else {
                            this.toastr.error(
                                `An error occurred while deleting Project Location. Please try again.`,
                                'ERROR!'
                            );
                        }
                    },
                    error: (err) => {
                        this.toastr.error(
                            `An error occurred while deleting Project Location. Please try again.`,
                            'ERROR!'
                        );
                    },
                });
        } else {
            this.projectLoc.removeAt(idx);
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
                            ...data,
                        };
                        this.toastr.success('Project Information has been successfully saved', 'SUCCESS!');
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
                organization_pk: this.project?.partner?.organization?.pk,
                project_website: value?.project_website,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        // this.project = {
                        //     ...this.project,
                        //     partner: {
                        //         ...this.project?.partner,
                        //         organization: {
                        //             ...data,
                        //         },
                        //     },
                        // };
                        this.toastr.success('Organization has been successfully saved', 'SUCCESS!');
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                project: this.project,
                            },
                        } as OnHiddenData);
                        this.bsModalRef.hide();
                    } else {
                        this.toastr.error(`An error occurred while saving Organization. Please try again.`, 'ERROR!');
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Proponent Information. ${statusCode} ${errorMessage} Please try again.`,
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
}
