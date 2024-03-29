import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from 'src/app/services/document.service';
import { GlobalService } from 'src/app/services/global.service';
import { ChangeFieldEventEmitter, SelectComponent } from 'src/app/components/select/select.component';
import { ApplicationService } from 'src/app/services/application.service';

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

const BENEFICIARY_TYPE = ['women', 'men', 'young_women', 'young_men'];
const BENEFICIARY_NAME = (type: string) => {
    const mainName = type?.split('_').join(' ');
    const tempName = type?.split('_');
    let diffName = type?.split('_')?.at(0);
    if (tempName.length > 1) {
        diffName = type?.split('_')?.at(1);
    }
    return [mainName, `diffable ${diffName}`, 'other vulnerable sector'];
};

@Component({
    selector: 'app-project-information',
    templateUrl: './project-information.component.html',
    styleUrls: ['./project-information.component.scss'],
})
export class ProjectInformationComponent implements OnInit {
    form: FormGroup;
    submitted = false;
    durationOpts: string[] = [];

    provinceOpts: ProvinceOpt[] = [];
    loadingProvinceOpts = true;
    projectLoc: FormArray;
    projBeneficiary: FormArray;

    applicationSignalService = inject(ApplicationSignalService);
    durationSelectChangeFieldEventEmitter = new EventEmitter<ChangeFieldEventEmitter>();
    provinceSelectChangeFieldEventEmitter = new EventEmitter<ChangeFieldEventEmitter>();

    constructor(
        private formBuilder: FormBuilder,
        private documentService: DocumentService,
        private globalService: GlobalService,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        public bsModalRef: BsModalRef
    ) {}

    ngOnInit() {
        this.getDurationOpts();
        this.fetchProvinces();
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    get formProjLocations() {
        return <FormArray>this.form.get('project_location');
    }

    get formProjBeneficiary() {
        return <FormArray>this.form.get('project_beneficiary');
    }

    setForm() {
        const currentApplication = this.applicationSignalService.appForm();
        const project = currentApplication?.project;
        this.form = this.formBuilder.group({
            title: [project?.title ?? '', Validators.required],
            duration: [project?.duration ?? '', Validators.required],
            background: [project?.background ?? '', Validators.required],
            objective: [project?.objective ?? '', Validators.required],
            expected_output: [project?.expected_output ?? '', Validators.required],
            how_will_affect: [project?.how_will_affect ?? '', Validators.required],
            project_beneficiary: this.formBuilder.array([]),
            project_location: this.formBuilder.array([], [Validators.required]),
        });
        this.initialBeneficiaries();
    }

    initialBeneficiaries() {
        this.projBeneficiary = this.form.get('project_beneficiary') as FormArray;
        const currentApplication = this.applicationSignalService.appForm();
        const projBeneficiary = currentApplication?.project?.project_beneficiary;
        const currentBeneficiary = projBeneficiary ?? [];
        BENEFICIARY_TYPE.forEach((type) => {
            const names = BENEFICIARY_NAME(type);
            names.forEach((name) => {
                const existingBeneficiary = currentBeneficiary?.find(
                    (item) => item?.type === type && item.name === name
                );
                const pk = existingBeneficiary?.pk;
                const count = existingBeneficiary?.count;
                this.projBeneficiary.push(this.createFormBeneficiaries(type, name, count, pk));
            });
        });
    }

    createFormBeneficiaries(type: string, name: string, count?: number, projBeneficiaryPk?: number): FormGroup {
        return this.formBuilder.group({
            pk: [projBeneficiaryPk ?? ''],
            type: [type],
            name: [name],
            count: [count ?? 0, Validators.required],
        });
    }

    initialProjLocations() {
        this.projectLoc = this.form.get('project_location') as FormArray;
        const currentApplication = this.applicationSignalService.appForm();
        const projLoc = currentApplication?.project?.project_location;
        const currentProjLoc = projLoc ?? [];
        currentProjLoc.forEach((projLoc, idx) => {
            this.projectLoc.push(this.createFormProjLocations(projLoc?.pk, projLoc.country_pk, projLoc.province_code));
            setTimeout(() => {
                this.provinceSelectChangeFieldEventEmitter.emit({
                    selectedItems: this.provinceOpts?.filter(
                        (province) => province.province_code === projLoc.province_code
                    ),
                    arr: this.getProvinceOpts(projLoc.country_pk as number),
                    key: idx.toString(),
                });
            }, 500);
        });
    }

    fetchProvinces() {
        this.loadingProvinceOpts = true;
        this.globalService.selectFetch(`province`).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data;
                if (!status) {
                    this.toastr.error('An error occurred while fetching Provinces', 'ERROR!');
                } else {
                    this.provinceOpts = data?.map((item: any) => ({
                        country_pk: item?.country_pk,
                        province_code: item?.province_code,
                        name: item?.name,
                    }));
                }
                this.initialProjLocations();
                this.loadingProvinceOpts = false;
            },
            error: (err) => {
                this.toastr.error('An error occurred while fetching Provinces', 'ERROR!');
                this.loadingProvinceOpts = false;
            },
        });
    }

    getProvinceOpts(countryPk: number) {
        return this.provinceOpts.filter((item) => item.country_pk === countryPk);
    }

    createFormProjLocations(projLocPk?: number, countryPk?: number, provinceCode?: number): FormGroup {
        return this.formBuilder.group({
            pk: [projLocPk ?? ''],
            country_pk: [countryPk ?? '', Validators.required],
            province_code: [provinceCode ?? '', Validators.required],
        });
    }

    getDurationOpts() {
        for (let i = 1; i <= 36; i++) {
            let suffix = 'Months';
            if (i === 1) {
                suffix = 'Month';
            }
            this.durationOpts.push(`${i} ${suffix}`);
        }
    }

    onAddProjLoc() {
        this.projectLoc = this.form.get('project_location') as FormArray;
        this.projectLoc.push(this.createFormProjLocations());
    }

    onDelProjLoc(idx: number) {
        const currentApplication = this.applicationSignalService.appForm();
        const project = currentApplication?.project;
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

    onAddProjectLoc() {
        this.projectLoc = this.form.get('project_location') as FormArray;
        this.projectLoc.push(this.createFormProjLocations());
    }

    onModifyProjLoc(
        item: SelectItem[],
        listItemKey: 'pk' | 'province_code',
        key: 'country_pk' | 'province_code',
        idx: number
    ) {
        const currentApplication = this.applicationSignalService.appForm();
        const project = currentApplication?.project;
        const projLoc = project?.project_location?.at(idx);
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.[listItemKey ?? ''] ?? '';
        if (key === 'country_pk') {
            this.projectLoc.controls.at(idx)?.setValue({
                pk: projLoc?.pk ?? '',
                country_pk: pk,
                province_code: '',
            });

            this.provinceSelectChangeFieldEventEmitter.emit({
                arr: this.getProvinceOpts(pk as number),
                selectedItems: [],
                key: idx.toString(),
            });
        } else {
            this.projectLoc.controls.at(idx)?.setValue({
                pk: projLoc?.pk ?? '',
                country_pk: this.projectLoc.at(idx).get('country_pk')?.value,
                province_code: pk,
            });
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

    saveFormValue(isNavigateNext?: boolean) {
        const currentApplication = this.applicationSignalService.appForm();
        const project = currentApplication?.project;
        const { value } = this.form;
        this.applicationService
            .saveApplicationProject({
                pk: project?.pk,
                application_pk: currentApplication?.pk,
                ...value,
                project_location: value?.project_location ?? [],
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;

                    if (status) {
                        this.applicationSignalService.appForm.set({
                            ...currentApplication,
                            project: {
                                ...data,
                            },
                        });

                        this.toastr.success('Project Information has been successfully saved', 'SUCCESS!');

                        if (isNavigateNext) {
                            this.applicationSignalService.navigateNext();
                        } else {
                            this.applicationSignalService.navigateBack();
                        }
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Project Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(
                        `An error occurred while saving Project Information. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    handleReset() {
        this.form.reset();
        this.durationSelectChangeFieldEventEmitter.emit({
            selectedItems: [],
        });
        this.onChangeSelectedItem([], 'duration');
        // this.resetBeneficiary();
        // this.resetProjLoc();
    }

    resetBeneficiary() {
        this.initialBeneficiaries();
    }

    resetProjLoc() {
        this.projectLoc.reset();
    }

    processForm(isNavigateNext?: boolean) {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue(isNavigateNext);
        }
    }

    handleNext() {
        this.processForm(true);
    }

    handleBack() {
        this.processForm();
    }

    saveAttachment(ev: any) {
        const currentApplication = this.applicationSignalService.application();
        this.documentService
            .save({
                table_pk: 1,
                table_name: 'projects',
                document_pk: ev.pk,
            })
            .subscribe({
                next: (data: any) => {
                    this.toastr.success('The document has been successfully uploaded', 'SUCCESS!');
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while uploading the document. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                    this.bsModalRef.hide();
                },
            });
    }
}
