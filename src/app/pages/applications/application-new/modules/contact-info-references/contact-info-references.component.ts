import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

const referencesFactory = () => {
    return [
        {
            pk: '',
            name: '',
            contact_number: '',
            email_address: '',
            organization_name: '',
        },
        {
            pk: '',
            name: '',
            contact_number: '',
            email_address: '',
            organization_name: '',
        },
        {
            pk: '',
            name: '',
            contact_number: '',
            email_address: '',
            organization_name: '',
        },
    ];
};
@Component({
    selector: 'app-contact-info-references',
    templateUrl: './contact-info-references.component.html',
    styleUrls: ['./contact-info-references.component.scss'],
})
export class ContactInfoReferencesComponent {
    form: FormGroup;
    contactReferences: FormArray;
    applicationSignalService = inject(ApplicationSignalService);
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {}

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
        const currentReferences =
            (currentApplication?.application_reference ?? []).length > 0
                ? currentApplication?.application_reference ?? []
                : referencesFactory();
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

    saveFormValue(isNavigateNext?: boolean) {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.appForm();
        this.applicationService
            .saveAppReference({
                application_pk: currentApplication?.pk,
                application_reference: value?.application_reference,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;

                    if (status) {
                        this.applicationSignalService.appForm.set({
                            ...currentApplication,
                            application_reference: data?.application_reference,
                        });

                        this.toastr.success('Contact Reference has been successfully saved', 'SUCCESS!');

                        if (isNavigateNext) {
                            this.applicationSignalService.submitSave.set(true);
                        } else {
                            this.applicationSignalService.navigateBack();
                        }
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Contact Reference. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(
                        `An error occurred while saving Contact Reference. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    processForm(isNavigateNext?: boolean) {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue(isNavigateNext);
        }
    }

    handleSave() {
        this.processForm(true);
    }

    handleBack() {
        this.processForm();
    }
}
