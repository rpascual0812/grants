import { Component, OnInit, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KIND_OF_ORGANIZATION_MAPPER, TRIBE_LIST_OPTIONS } from '../../utilities/constants';
import { GlobalService } from 'src/app/services/global.service';

type SelectItem = {
    pk: number;
    name: string;
};

@Component({
    selector: 'app-organization-profile',
    templateUrl: './organization-profile.component.html',
    styleUrls: ['./organization-profile.component.scss'],
})
export class OrganizationProfileComponent implements OnInit {
    form: FormGroup;
    orgListLoading = false;
    orgList: SelectItem[] = [];
    selectedOrganization: string = '';
    submitted = false;
    applicationSignalService = inject(ApplicationSignalService);
    tribeIndicateList = TRIBE_LIST_OPTIONS;

    constructor(private formBuilder: FormBuilder, private globalService: GlobalService) {}

    ngOnInit() {
        this.setForm();
        this.fetchOrgList();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const currentApplication = this.applicationSignalService.application();
        this.form = this.formBuilder.group({
            organization_pk: [currentApplication?.organization_profile?.organization_pk ?? '', Validators.required],
            mission: [currentApplication?.organization_profile?.mission ?? ''],
            vision: [currentApplication?.organization_profile?.vision ?? ''],
            description: [currentApplication?.organization_profile?.description ?? '', Validators.required],
            country_pk: [currentApplication?.organization_profile?.country_pk ?? '', Validators.required],
            project_website: [currentApplication?.organization_profile?.project_website ?? ''],
            tribe: [currentApplication?.organization_profile?.tribe ?? ''],
            womens_organization: [currentApplication?.organization_profile?.womens_organization ?? false],
            differently_abled_organization: [
                currentApplication?.organization_profile?.differently_abled_organization ?? false,
            ],
            farmers_group: [currentApplication?.organization_profile?.farmers_group ?? false],
            youth_organization: [currentApplication?.organization_profile?.youth_organization ?? false],
            fisherfolks: [currentApplication?.organization_profile?.fisherfolks ?? false],
            other_sectoral_group: [currentApplication?.organization_profile?.other_sectoral_group ?? ''],
        });
    }

    initialSelectedOrg(orgList: SelectItem[]) {
        const currentApplication = this.applicationSignalService.application();
        const orgPk = currentApplication?.organization_profile?.organization_pk;
        this.selectedOrganization = orgPk ? orgList?.find((org) => org.pk === orgPk)?.name ?? '' : '';
    }

    fetchOrgList() {
        this.orgListLoading = true;
        this.globalService.selectFetch(`organization`).subscribe({
            next: (res: any) => {
                this.orgList = res?.data ?? [];
                this.initialSelectedOrg(this.orgList);
                this.orgListLoading = false;
            },
            error: (error: any) => {
                console.log(error);
                setTimeout(() => {
                    this.orgListLoading = false;
                }, 500);
            },
            complete: () => {
                console.log('Complete');
                setTimeout(() => {
                    this.orgListLoading = false;
                }, 500);
            },
        });
    }

    // TODO: can this refactored to be simpler?
    onChangeSelectedItem(item: SelectItem[] | string[], key: string) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.pk ?? '';

        if (!extractedItem && key === 'organization_pk') {
            this.selectedOrganization = '';
        }

        if (pk) {
            if (key === 'organization_pk') {
                this.selectedOrganization = this.orgList?.find((org) => org.pk === pk)?.name ?? '';
                this.setDefaultValues(this.selectedOrganization);
            }
            this.form.controls[key].setValue(pk);
        } else {
            this.form.controls[key].setValue(extractedItem ?? '');
        }
    }

    setDefaultValues(selectedOrgPk: string) {
        const defaultEmptyFields = ['tribe', 'other_sectoral_group'];
        defaultEmptyFields.forEach((key) => this.form.controls[key].setValue(''));

        if (selectedOrgPk === KIND_OF_ORGANIZATION_MAPPER[1]) {
            const defaultTrueFields = ['womens_organization', 'differently_abled_organization', 'youth_organization'];
            defaultTrueFields.forEach((key) => this.onChangeSelectedBoolOpt('true', key));

            const defaultFalseFields = ['youth_organization', 'fisherfolks', 'farmers_group'];
            defaultFalseFields.forEach((key) => this.onChangeSelectedBoolOpt('false', key));
            return;
        }

        if (selectedOrgPk === KIND_OF_ORGANIZATION_MAPPER[2] || selectedOrgPk === KIND_OF_ORGANIZATION_MAPPER[3]) {
            const defaultTrueFields = [
                'womens_organization',
                'differently_abled_organization',
                'farmers_group',
                'youth_organization',
                'fisherfolks',
            ];
            defaultTrueFields.forEach((key) => this.onChangeSelectedBoolOpt('true', key));
            return;
        }

        if (selectedOrgPk === KIND_OF_ORGANIZATION_MAPPER[4]) {
            const defaultFalseFields = [
                'womens_organization',
                'differently_abled_organization',
                'youth_organization',
                'farmers_group',
                'fisherfolks',
            ];
            defaultFalseFields.forEach((key) => this.onChangeSelectedBoolOpt('false', key));
            this.form.controls['tribe'].setValue(this.tribeIndicateList?.at(0) ?? '');
            return;
        }
    }

    onChangeSelectedBoolOpt(value: string, key: string) {
        this.form.controls[key].setValue(value === 'true' ? true : false);
    }

    saveFormValue() {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.application();
        this.applicationSignalService.application.set({
            ...currentApplication,
            organization_profile: {
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
