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
    selectedOrganization: string = '';
    tribeIndicateList = TRIBE_LIST_OPTIONS;
    selectChangeFieldEventEmitter = {
        organization_pk: new EventEmitter<ChangeFieldEventEmitter>(),
        country_pk: new EventEmitter<ChangeFieldEventEmitter>(),
    };

    constructor(
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
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

    get formContactReferences() {
        return <FormArray>this.form.get('application_reference');
    }

    setForm() {
        const appOrg = this.partner?.organization;
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

    initialSaveFormValue() {
        this.processing = true;
        const { value } = this.form;
        this.applicationService
            .saveApplicationPartnerOrg({
                partner_id: this.partner?.partner_id,
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
                partner_organization_pk: this.partner?.organization?.pk,
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
