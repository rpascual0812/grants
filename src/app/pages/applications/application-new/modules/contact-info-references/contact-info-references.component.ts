import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PartnerOrganizationReference } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { REFERENCES_FACTORY } from 'src/app/utilities/constants';


@Component({
    selector: 'app-contact-info-references',
    templateUrl: './contact-info-references.component.html',
    styleUrls: ['./contact-info-references.component.scss'],
})
export class ContactInfoReferencesComponent {
    processing = false;
    form: FormGroup;
    contactReferences: FormArray;
    applicationSignalService = inject(ApplicationSignalService);
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    get formContactReferences() {
        return <FormArray>this.form.get('application_reference');
    }

    setForm() {
        this.form = this.formBuilder.group({
            application_reference: this.formBuilder.array([]),
        });
        this.initialReferences();
    }

    initialReferences() {
        this.contactReferences = this.form.get('application_reference') as FormArray;
        const currentApplication = this.applicationSignalService?.appForm();
        const partnerOrgReferences = currentApplication?.partner?.organization?.partner_organization_reference ?? [];
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

    saveCurrentAppForm(data: PartnerOrganizationReference[]) {
        const currentApplication = this.applicationSignalService.appForm();
        const partner = currentApplication?.partner;
        const organization = partner?.organization;
        this.applicationSignalService.appForm.set({
            ...currentApplication,
            partner: {
                ...partner,
                organization: {
                    ...organization,
                    pk: organization?.pk,
                    partner_organization_reference: [...data],
                },
            },
        });
    }

    saveFormValue() {
        this.processing = true;
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.appForm();
        this.applicationService
            .saveAppReference({
                partner_organization_pk: currentApplication?.partner?.organization?.pk,
                partner_organization_reference: value?.application_reference,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data?.partner_organization_reference ?? [];
                    const status = res?.status;
                    if (status) {
                        this.saveCurrentAppForm(data);
                        this.toastr.success('Contact Reference has been successfully saved', 'SUCCESS!');
                        this.applicationSignalService.submitSave.set(true);
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

    handleSave() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
        }
    }

    handleBack() {
        const { value } = this.form;
        this.saveCurrentAppForm(value?.application_reference ?? []);
        this.applicationSignalService.navigateBack();
    }
}
