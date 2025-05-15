import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ChangeFieldEventEmitter } from 'src/app/components/select/select.component';
import { ApplicationService } from 'src/app/services/application.service';
import { GlobalService } from 'src/app/services/global.service';
import { PartnerForm } from 'src/app/services/partner.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { KIND_OF_ORGANIZATION_MAPPER, REFERENCES_FACTORY, TRIBE_LIST_OPTIONS } from 'src/app/utilities/constants';
import { OnHiddenData } from '../../../partner-view/partner-view.component';
import { OrganizationPartnerType } from 'src/app/interfaces/_application.interface';

type SelectItem = {
    pk: number;
    name: string;
};

@Component({
    selector: 'app-org-profile-view',
    templateUrl: './org-profile-view.component.html',
    styleUrls: ['./org-profile-view.component.scss'],
})
export class OrgProfileViewComponent implements OnInit {
    @Input() partner: PartnerForm | null = null;
    processing = false;
    submitted = false;
    form: FormGroup;
    contactReferences: FormArray;
    orgListLoading = false;
    orgList: SelectItem[] = [];
    orgPartnerTypeListLoading = false;
    orgPartnerTypeList: SelectItem[] = [];

    selectedOrganization: string = '';
    organizationPartnerTypeData: OrganizationPartnerType[] = [];
    tribeIndicateList = TRIBE_LIST_OPTIONS;
    selectChangeFieldEventEmitter = {
        organization_pk: new EventEmitter<ChangeFieldEventEmitter>(),
        country_pk: new EventEmitter<ChangeFieldEventEmitter>(),
        organization_partner_type_pk: new EventEmitter<ChangeFieldEventEmitter>(),
    };

    constructor(
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.setForm();
        this.fetchOrgList();
        this.fetchOrgPartnerTypeList();
    }

    get f() {
        return this.form.controls;
    }

    get formContactReferences() {
        return <FormArray>this.form.get('application_reference');
    }

    setForm() {
        const appOrg = this.partner?.organization;
        this.form = this.formBuilder.group({
            organization_pk: [appOrg?.organization_pk ?? '', Validators.required],
            organization_partner_type_pk: [appOrg?.organization_partner_type_pk ?? '', Validators.required],
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
            application_reference: this.formBuilder.array([]),
        });
        this.initialReferences();
    }

    initialReferences() {
        this.contactReferences = this.form.get('application_reference') as FormArray;
        const partnerOrgReferences = this.partner?.organization?.partner_organization_reference ?? [];
        const currentReferences = partnerOrgReferences.length > 0 ? partnerOrgReferences : REFERENCES_FACTORY();
        currentReferences.forEach((ref) => {
            this.contactReferences.push(
                this.createFormBeneficiaries(
                    ref?.pk,
                    ref?.name,
                    ref?.email_address,
                    ref?.contact_number,
                    ref?.organization_name
                )
            );
        });
    }

    createFormBeneficiaries(
        pk?: number | string,
        name?: string,
        email_address?: string,
        contact_number?: string,
        organization_name?: string
    ): FormGroup {
        return this.formBuilder.group({
            pk: [pk ?? ''],
            name: [name ?? '', Validators.required],
            email_address: [email_address ?? '', [Validators.email, Validators.required]],
            contact_number: [contact_number ?? '', Validators.required],
            organization_name: [organization_name ?? '', Validators.required],
        });
    }

    initialSelectedOrg(orgList: SelectItem[]) {
        const appOrg = this.partner?.organization;
        const orgPk = appOrg?.organization_pk;
        this.selectedOrganization = orgPk ? orgList?.find((org) => org.pk === orgPk)?.name ?? '' : '';
        if (this.selectedOrganization === KIND_OF_ORGANIZATION_MAPPER[4]) {
            this.addValidators(`tribe`);
        }
    }

    filterOrgPartnerTypeList() {
        const selectedOrgPk = this.form?.controls?.['organization_pk']?.value;

        this.orgPartnerTypeList =
            this.organizationPartnerTypeData
                ?.filter((value) => value?.organization_pk === selectedOrgPk)
                ?.filter((value) => value?.name && value?.pk)
                ?.map((value) => ({
                    name: value.name as string,
                    pk: value.pk as number,
                })) ?? [];

        this.selectChangeFieldEventEmitter.organization_partner_type_pk.emit({
            arr: this.orgPartnerTypeList ?? [],
            selectedItems: [],
        });
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

    fetchOrgPartnerTypeList() {
        this.orgPartnerTypeListLoading = true;
        this.globalService.selectFetch(`organization/partner_type`).subscribe({
            next: (res: any) => {
                if (res.status) {
                    this.organizationPartnerTypeData = res?.data ?? [];
                    this.filterOrgPartnerTypeList();
                } else {
                    this.toastr.error(
                        `An error occurred while fetching organization partner type. Please try again.`,
                        'ERROR!'
                    );
                }
                this.orgPartnerTypeListLoading = false;
            },
            error: (err: any) => {
                const { errorMessage, statusCode } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching organization partner type. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.orgPartnerTypeListLoading = false;
            },
        });
    }

    // TODO: can this refactored to be simpler?
    onChangeSelectedItem(item: SelectItem[] | string[], key: string) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.pk ?? '';

        if (key === 'organization_pk') {
            this.onSelectOrganization(extractedItem, pk);
        } else {
            this.onSelectCommon(key, extractedItem, pk);
        }
    }

    onSelectCommon(key: string, extractedItem?: SelectItem | string, pk?: number) {
        if (pk) {
            this.form.controls[key].setValue(pk);
        } else {
            this.form.controls[key].setValue(extractedItem ?? '');
        }
    }

    onSelectOrganization(extractedItem?: SelectItem | string, pk?: number) {
        if (!extractedItem) {
            this.selectedOrganization = '';
        }

        if (pk) {
            this.selectedOrganization = this.orgList?.find((org) => org.pk === pk)?.name ?? '';
            this.setDefaultValues(this.selectedOrganization);
            this.form.controls['organization_pk'].setValue(pk);
        } else {
            this.form.controls['organization_pk'].setValue(extractedItem ?? '');
        }

        this.filterOrgPartnerTypeList();
    }

    setDefaultValues(selectedOrgPk: string) {
        const defaultEmptyFields = ['tribe', 'other_sectoral_group'];
        defaultEmptyFields.forEach((key) => this.form.controls[key].setValue(''));

        if (selectedOrgPk === KIND_OF_ORGANIZATION_MAPPER[1]) {
            const defaultTrueFields = ['womens_organization', 'differently_abled_organization', 'youth_organization'];
            defaultTrueFields.forEach((key) => this.onChangeSelectedBoolOpt('true', key));

            const defaultFalseFields = ['youth_organization', 'fisherfolks', 'farmers_group'];
            defaultFalseFields.forEach((key) => this.onChangeSelectedBoolOpt('false', key));
            this.removeValidators(`tribe`);
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
            this.removeValidators(`tribe`);
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
            this.addValidators(`tribe`);
            return;
        }
    }

    addValidators(key: string) {
        this.form.controls[key]?.addValidators(Validators?.required);
        this.form.controls[key]?.updateValueAndValidity();
    }

    removeValidators(key: string) {
        this.form?.controls?.[key]?.setErrors(null);
        this.form?.controls?.[key]?.clearValidators();
        this.form?.controls?.[key]?.updateValueAndValidity();
    }

    onChangeSelectedBoolOpt(value: string, key: string) {
        this.form.controls[key].setValue(value === 'true' ? true : false);
    }

    initialSaveFormValue() {
        this.processing = true;
        const { value } = this.form;
        this.applicationService
            .saveApplicationPartnerOrg({
                partner_id: this.partner?.partner_id,
                partner_pk: this.partner?.pk,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        const currentSavedData = {
                            ...this.partner,
                            organization: {
                                ...data,
                                partner_organization_reference: [
                                    ...(this.partner?.organization?.partner_organization_reference ?? []),
                                ],
                            },
                        };
                        this.finalSaveFormValue(currentSavedData);
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Organization Profile. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Organization Profile. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    finalSaveFormValue(currentSavedData: PartnerForm) {
        this.processing = true;
        const { value } = this.form;
        this.applicationService
            .saveAppReference({
                partner_organization_pk: this.partner?.organization?.pk ? this.partner?.organization?.pk : currentSavedData?.organization?.pk,
                partner_organization_reference: value?.application_reference,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data?.partner_organization_reference ?? [];
                    const status = res?.status;
                    if (status) {
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                ...currentSavedData,
                                organization: {
                                    ...currentSavedData.organization,
                                    partner_organization_reference: [...(data ?? [])],
                                },
                            },
                        } as OnHiddenData);
                        this.bsModalRef.hide();
                        this.toastr.success('Organization Profile has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Contact Reference. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Contact Reference. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    handleClose() {
        this.bsModalRef.hide();
    }

    handleSave() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.initialSaveFormValue();
        }
    }
}
