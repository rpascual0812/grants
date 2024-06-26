import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from 'src/app/services/document.service';
import { GlobalService } from 'src/app/services/global.service';
import { ChangeFieldEventEmitter, SelectComponent } from 'src/app/components/select/select.component';
import { ApplicationService } from 'src/app/services/application.service';
import * as _ from '../../../../../utilities/globals';
import { Project } from 'src/app/interfaces/_application.interface';
import { extractErrorMessage, getDurationOpts } from 'src/app/utilities/application.utils';

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

const DOCUMENT_TYPE = 'project_information';

@Component({
    selector: 'app-project-information',
    templateUrl: './project-information.component.html',
    styleUrls: ['./project-information.component.scss'],
})
export class ProjectInformationComponent implements OnInit {
    processing = false;
    form: FormGroup;
    formGroupProjectBeneficiary: FormGroup;

    submitted = false;
    durationOpts: string[] = [];

    provinceOpts: ProvinceOpt[] = [];
    loadingProvinceOpts = true;
    projectLoc: FormArray;
    projBeneficiary: FormArray;

    attachments: any = [];
    SERVER: string = _.BASE_URL;

    applicationSignalService = inject(ApplicationSignalService);

    SELECT_PROVINCE_KEY_PREFIX = 'province_';
    SELECT_COUNTRY_KEY_PREFIX = 'country_';
    selectChangeFieldEventEmitter = {
        durationSelectChangeFieldEventEmitter: new EventEmitter<ChangeFieldEventEmitter>(),
        countrySelectChangeFieldEventEmitter: new EventEmitter<ChangeFieldEventEmitter>(),
        provinceSelectChangeFieldEventEmitter: new EventEmitter<ChangeFieldEventEmitter>(),
    };

    constructor(
        private formBuilder: FormBuilder,
        private documentService: DocumentService,
        private globalService: GlobalService,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        public bsModalRef: BsModalRef
    ) {}

    ngOnInit() {
        this.durationOpts = getDurationOpts();
        this.fetchProvinces();
        this.setForm();

        const currentApplication = this.applicationSignalService.appForm();
        const documents = currentApplication?.documents ?? [];
        if (documents?.length > 0) {
            this.attachments = documents?.filter((item) => item.type === DOCUMENT_TYPE);
        }
    }

    get f() {
        return this.form.controls;
    }

    get formProjectBeneficiary() {
        return (this.form.get('project_beneficiary') as FormGroup).controls;
    }

    get formProjLocations() {
        return <FormArray>this.form.get('project_location');
    }

    setForm() {
        const currentApplication = this.applicationSignalService.appForm();
        const project = currentApplication?.project;
        const projectBeneficiary = project?.project_beneficiary;
        this.form = this.formBuilder.group({
            title: [project?.title ?? '', Validators.required],
            duration: [project?.duration ?? '', Validators.required],
            background: [project?.background ?? '', Validators.required],
            objective: [project?.objective ?? '', Validators.required],
            expected_output: [project?.expected_output ?? '', Validators.required],
            how_will_affect: [project?.how_will_affect ?? '', Validators.required],
            project_beneficiary: this.formBuilder.group({
                pk: [projectBeneficiary?.pk ?? 0],
                women_count: [projectBeneficiary?.women_count ?? 0, Validators.required],
                women_diffable_count: [projectBeneficiary?.women_diffable_count ?? 0, Validators.required],
                women_other_vulnerable_sector_count: [
                    projectBeneficiary?.women_other_vulnerable_sector_count ?? 0,
                    Validators.required,
                ],
                young_women_count: [projectBeneficiary?.young_women_count ?? 0, Validators.required],
                young_women_diffable_count: [projectBeneficiary?.young_women_diffable_count ?? 0, Validators.required],
                young_women_other_vulnerable_sector_count: [
                    projectBeneficiary?.young_women_other_vulnerable_sector_count ?? 0,
                    Validators.required,
                ],
                men_count: [projectBeneficiary?.men_count ?? 0, Validators.required],
                men_diffable_count: [projectBeneficiary?.men_diffable_count ?? 0, Validators.required],
                men_other_vulnerable_sector_count: [
                    projectBeneficiary?.men_other_vulnerable_sector_count ?? 0,
                    Validators.required,
                ],
                young_men_count: [projectBeneficiary?.young_men_count ?? 0, Validators.required],
                young_men_diffable_count: [projectBeneficiary?.young_men_diffable_count ?? 0, Validators.required],
                young_men_other_vulnerable_sector_count: [
                    projectBeneficiary?.young_men_other_vulnerable_sector_count ?? 0,
                    Validators.required,
                ],
            }),
            project_location: this.formBuilder.array([], [Validators.required]),
        });
        this.formGroupProjectBeneficiary = this.form.get('project_beneficiary') as FormGroup;
    }

    initialProjLocations() {
        this.projectLoc = this.form.get('project_location') as FormArray;
        const currentApplication = this.applicationSignalService.appForm();
        const projLoc = currentApplication?.project?.project_location;
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

    saveCurrentAppForm(data: Project) {
        const currentApplication = this.applicationSignalService.appForm();
        const project = currentApplication?.project;
        this.applicationSignalService.appForm.set({
            ...currentApplication,
            project: {
                pk: data?.pk ?? project?.pk,
                ...project,
                ...data,
            },
        });
    }
    saveFormValue() {
        this.processing = true;
        const currentApplication = this.applicationSignalService.appForm();
        const project = currentApplication?.project;
        const { value } = this.form;
        this.applicationService
            .saveApplicationProject({
                pk: project?.pk,
                application_pk: currentApplication?.pk,
                ...value,
                project_beneficiary: {
                    project_pk: project?.pk,
                    ...value.project_beneficiary,
                },
                project_location: value?.project_location ?? [],
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res?.status;

                    if (status) {
                        this.saveCurrentAppForm(data);
                        this.toastr.success('Project Information has been successfully saved', 'SUCCESS!');
                        this.applicationSignalService.navigateNext();
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

    resetAvailableFields() {
        const manualResetFields = ['project_location'];
        const fieldsToReset = Object.keys(this.form.controls).filter((key) => !manualResetFields.includes(key));
        fieldsToReset.forEach((field) => {
            this.form.controls[field].reset();
        });
    }
    handleReset() {
        this.resetAvailableFields();
        this.selectChangeFieldEventEmitter.durationSelectChangeFieldEventEmitter.emit({
            selectedItems: [],
        });
        this.onChangeSelectedItem([], 'duration');
        this.resetProjLoc();
    }

    resetProjLoc() {
        this.formProjLocations?.controls?.forEach((item, idx) => {
            item.get('country_pk')?.setValue('');
            item.get('province_code')?.setValue('');
            this.selectChangeFieldEventEmitter.countrySelectChangeFieldEventEmitter.emit({
                selectedItems: [],
                key: `${this.SELECT_COUNTRY_KEY_PREFIX}${idx.toString()}`,
            });
            this.selectChangeFieldEventEmitter.provinceSelectChangeFieldEventEmitter.emit({
                arr: [],
                selectedItems: [],
                key: `${this.SELECT_PROVINCE_KEY_PREFIX}${idx.toString()}`,
            });
        });
    }

    handleNext() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
        }
    }

    handleBack() {
        const { value } = this.form;
        this.saveCurrentAppForm(value);
        this.applicationSignalService.navigateBack();
    }

    saveAttachment(ev: any) {
        const currentApplication = this.applicationSignalService.appForm();
        this.documentService
            .save({
                table_pk: currentApplication?.pk,
                table_name: 'applications',
                document_pk: ev.pk,
                type: 'project_information',
            })
            .subscribe({
                next: (data: any) => {
                    this.applicationSignalService.setDocuments(this.attachments, DOCUMENT_TYPE);
                    this.toastr.success('The document has been successfully uploaded', 'SUCCESS!');
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while uploading the document. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                },
            });
    }

    onRemoveAttachment(ev: any) {
        this.applicationSignalService.removeDocument(ev);
    }
}
