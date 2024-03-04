import { Component, OnInit, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PROVINCE_URL_FETCH_STATUS } from '../../utilities/constants';


type SelectItem = {
    pk?: number;
    province_code?: number;
    name: string;
};

const beneficiaryFactory = (type: string) => {
    if (type === 'women') {
        return [
            { type: 'women', name: 'Women', count: 150 },
            { type: 'women', name: 'Diffable Women', count: 150 },
            { type: 'women', name: 'Other Vulnerable Sector', count: 150 },
        ];
    }

    if (type === 'young_women') {
        return [
            { type: 'young_women', name: 'Young Women', count: 150 },
            { type: 'young_women', name: 'Diffable Women', count: 150 },
            { type: 'young_women', name: 'Other Vulnerable Sector', count: 150 },
        ];
    }

    if (type === 'men') {
        return [
            { type: 'men', name: 'Men', count: 150 },
            { type: 'men', name: 'Diffable Men', count: 150 },
            { type: 'men', name: 'Other Vulnerable Sector', count: 150 },
        ];
    }

    if (type === 'young_men') {
        return [
            { type: 'young_men', name: 'Young Men', count: 150 },
            { type: 'young_men', name: 'Diffable Men', count: 150 },
            { type: 'young_men', name: 'Other Vulnerable Sector', count: 150 },
        ];
    }

    return [];
};

@Component({
    selector: 'app-project-information',
    templateUrl: './project-information.component.html',
    styleUrls: ['./project-information.component.scss'],
})
export class ProjectInformationComponent implements OnInit {
    form: FormGroup;
    provinceUrlFetchStatus = PROVINCE_URL_FETCH_STATUS;
    submitted = false;
    durationOpts: string[] = [];
    projectLoc: FormArray;
    beneficiaryWomen: FormArray;
    beneficiaryMen: FormArray;
    beneficiaryYoungWomen: FormArray;
    beneficiaryYoungMen: FormArray;
    applicationSignalService = inject(ApplicationSignalService);

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.getDurationOpts();
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    get formProjLocations() {
        return <FormArray>this.form.get('project_locations');
    }

    get formBeneficiaryWomen() {
        return <FormArray>this.form.get('beneficiary_women');
    }

    get formBeneficiaryMen() {
        return <FormArray>this.form.get('beneficiary_men');
    }

    get formBeneficiaryYoungWomen() {
        return <FormArray>this.form.get('beneficiary_young_women');
    }

    get formBeneficiaryYoungMen() {
        return <FormArray>this.form.get('beneficiary_young_men');
    }

    setForm() {
        const currentApplication = this.applicationSignalService.application();
        this.form = this.formBuilder.group({
            title: [currentApplication?.project?.title ?? '', Validators.required],
            duration: [currentApplication?.project?.duration ?? '', Validators.required],
            background: [currentApplication?.project?.background ?? '', Validators.required],
            objective: [currentApplication?.project?.objective ?? '', Validators.required],
            expected_output: [currentApplication?.project?.expected_output ?? '', Validators.required],
            how_will_affect: [currentApplication?.project?.how_will_affect ?? '', Validators.required],
            beneficiary_women: this.formBuilder.array([]),
            beneficiary_men: this.formBuilder.array([]),
            beneficiary_young_women: this.formBuilder.array([]),
            beneficiary_young_men: this.formBuilder.array([]),
            project_locations: this.formBuilder.array([], [Validators.required]),
        });
        this.initialProjLocations();
        this.initialBeneficiaries();
    }

    initialBeneficiaries() {
        this.beneficiaryWomen = this.form.get('beneficiary_women') as FormArray;
        const currentApplication = this.applicationSignalService.application();
        const currentBeneficiaryWomen = currentApplication?.project?.beneficiary_women ?? beneficiaryFactory('women');
        currentBeneficiaryWomen.forEach((beneficiary) =>
            this.beneficiaryWomen.push(
                this.createFormBeneficiaries(
                    beneficiary?.type as string,
                    beneficiary?.name as string,
                    beneficiary?.count as number
                )
            )
        );

        this.beneficiaryMen = this.form.get('beneficiary_men') as FormArray;
        const currentBeneficiaryMen = currentApplication?.project?.beneficiary_men ?? beneficiaryFactory('men');
        currentBeneficiaryMen.forEach((beneficiary) =>
            this.beneficiaryMen.push(
                this.createFormBeneficiaries(
                    beneficiary?.type as string,
                    beneficiary?.name as string,
                    beneficiary?.count as number
                )
            )
        );

        this.beneficiaryYoungWomen = this.form.get('beneficiary_young_women') as FormArray;
        const currentBeneficiaryYoungWomen =
            currentApplication?.project?.beneficiary_young_women ?? beneficiaryFactory('young_women');
        currentBeneficiaryYoungWomen.forEach((beneficiary) =>
            this.beneficiaryYoungWomen.push(
                this.createFormBeneficiaries(
                    beneficiary?.type as string,
                    beneficiary?.name as string,
                    beneficiary?.count as number
                )
            )
        );

        this.beneficiaryYoungMen = this.form.get('beneficiary_young_men') as FormArray;
        const currentBeneficiaryYoungMen =
            currentApplication?.project?.beneficiary_young_men ?? beneficiaryFactory('young_men');
        currentBeneficiaryYoungMen.forEach((beneficiary) =>
            this.beneficiaryYoungMen.push(
                this.createFormBeneficiaries(
                    beneficiary?.type as string,
                    beneficiary?.name as string,
                    beneficiary?.count as number
                )
            )
        );
    }

    createFormBeneficiaries(type: string, name: string, count: number): FormGroup {
        return this.formBuilder.group({
            type: [type],
            name: [name],
            count: [count, Validators.required],
        });
    }

    initialProjLocations() {
        this.projectLoc = this.form.get('project_locations') as FormArray;
        const currentApplication = this.applicationSignalService.application();
        const currentProjLoc = currentApplication?.project?.project_locations ?? [];
        currentProjLoc.forEach((proj) => {
            this.projectLoc.push(
                this.createFormProjLocations(proj.country_pk, proj.province_code, proj.province_code_url)
            );
        });
    }

    createFormProjLocations(countryPk?: number, provinceCode?: number, urlFetchStatus?: string): FormGroup {
        return this.formBuilder.group({
            country_pk: [countryPk ?? '', Validators.required],
            province_code: [provinceCode ?? '', Validators.required],
            province_code_url: [urlFetchStatus ?? this.provinceUrlFetchStatus.notReady],
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
        this.projectLoc = this.form.get('project_locations') as FormArray;
        this.projectLoc.push(this.createFormProjLocations());
    }

    onDelProjLoc(idx: number) {
        this.projectLoc.removeAt(idx);
    }

    onAddProjectLoc() {
        this.projectLoc = this.form.get('project_locations') as FormArray;
        this.projectLoc.push(this.createFormProjLocations());
    }

    onModifyProjLoc(
        item: SelectItem[],
        listItemKey: 'pk' | 'province_code',
        key: 'country_pk' | 'province_code',
        idx: number
    ) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.[listItemKey ?? ''] ?? '';
        if (key === 'country_pk') {
            this.projectLoc.controls.at(idx)?.setValue({
                country_pk: pk,
                province_code: '',
                province_code_url: this.provinceUrlFetchStatus.notReady,
            });
            this.refetchProvinceList(idx, pk);
        } else {
            this.projectLoc.controls.at(idx)?.setValue({
                country_pk: this.projectLoc.at(idx).get('country_pk')?.value,
                province_code: pk,
                province_code_url: this.provinceUrlFetchStatus.ready,
            });
        }
    }

    refetchProvinceList(idx: number, pk: number | string) {
        setTimeout(() => {
            this.projectLoc.controls.at(idx)?.setValue({
                country_pk: pk,
                province_code: '',
                province_code_url: this.provinceUrlFetchStatus.ready,
            });
        }, 500);
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

    saveFormValue() {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.application();
        this.applicationSignalService.application.set({
            ...currentApplication,
            project: {
                ...value,
            },
        });
    }

    handleNext() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
            this.applicationSignalService.navigateNext();
        }
    }

    handleBack() {
        this.saveFormValue();
        this.applicationSignalService.navigateBack();
    }
}
