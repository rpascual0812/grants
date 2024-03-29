import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KIND_OF_ORGANIZATION_MAPPER, TRIBE_LIST_OPTIONS } from '../../../../../utilities/constants';
import { GlobalService } from 'src/app/services/global.service';
import { ApplicationService } from 'src/app/services/application.service';
import { ToastrService } from 'ngx-toastr';

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
    selectChangeFieldEventEmitter = {
        organization_pk: new EventEmitter<any>(),
        country_pk: new EventEmitter<any>(),
    };
    constructor(
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.setForm();
        this.fetchOrgList();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const currentApplication = this.applicationSignalService.appForm();
        const appOrg = currentApplication?.partner?.organization;
        this.form = this.formBuilder.group({
            organization_pk: [appOrg?.organization_pk ?? '', Validators.required],
            mission: [appOrg?.mission ?? ''],
            vision: [appOrg?.vision ?? ''],
            description: [appOrg?.description ?? '', Validators.required],
            country_pk: [appOrg?.country_pk ?? '', Validators.required],
            project_website: [appOrg?.project_website ?? ''],
            tribe: [appOrg?.tribe ?? ''],
            womens_organization: [appOrg?.womens_organization ?? false],
            differently_abled_organization: [appOrg?.differently_abled_organization ?? false],
            farmers_group: [appOrg?.farmers_group ?? false],
            youth_organization: [appOrg?.youth_organization ?? false],
            fisherfolks: [appOrg?.fisherfolks ?? false],
            other_sectoral_group: [appOrg?.other_sectoral_group ?? ''],
        });
    }

    initialSelectedOrg(orgList: SelectItem[]) {
        const currentApplication = this.applicationSignalService.appForm();
        const appOrg = currentApplication?.partner?.organization;
        const orgPk = appOrg?.organization_pk;
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
            error: (err: any) => {
                setTimeout(() => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(
                        `An error occurred while fetching organization. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
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

    saveFormValue(isNavigateNext?: boolean) {
        const currentApplication = this.applicationSignalService.appForm();
        const { value } = this.form;
        this.applicationService
            .saveApplicationPartnerOrg({
                partner_id: currentApplication?.partner?.partner_id,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.applicationSignalService.appForm.set({
                            ...currentApplication,
                            partner: {
                                ...currentApplication?.partner,
                                organization: {
                                    ...data,
                                },
                            },
                        });

                        this.toastr.success('Organization Profile has been successfully saved', 'SUCCESS!');

                        if (isNavigateNext) {
                            this.applicationSignalService.navigateNext();
                        } else {
                            this.applicationSignalService.navigateBack();
                        }
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Proponent Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(
                        `An error occurred while saving Proponent Information. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    handleReset() {
        this.form.reset();
        this.onChangeSelectedItem([], 'organization_pk');
        this.onChangeSelectedItem([], 'country_pk');
        this.selectChangeFieldEventEmitter.organization_pk.emit({
            selectedItems: [],
        });
        this.selectChangeFieldEventEmitter.country_pk.emit({
            selectedItems: [],
        });
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
}
