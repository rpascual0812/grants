import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

const referencesFactory = () => {
    return [
        {
            name: '',
            contact_number: '',
            email_address: '',
            organization_name: '',
        },
        {
            name: '',
            contact_number: '',
            email_address: '',
            organization_name: '',
        },
        {
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

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    get formContactReferences() {
        return <FormArray>this.form.get('references');
    }

    setForm() {
        this.form = this.formBuilder.group({
            references: this.formBuilder.array([]),
        });
        this.initialReferences();
    }

    initialReferences() {
        this.contactReferences = this.form.get('references') as FormArray;
        const currentApplication = this.applicationSignalService.application();
        const currentReferences = currentApplication?.references ?? referencesFactory();
        currentReferences.forEach((ref) => {
            this.contactReferences.push(
                this.createFormBeneficiaries(ref?.name, ref?.email_address, ref?.contact_number, ref?.organization_name)
            );
        });
    }

    createFormBeneficiaries(
        name?: string,
        email_address?: string,
        contact_number?: string,
        organization_name?: string
    ): FormGroup {
        return this.formBuilder.group({
            name: [name ?? ''],
            email_address: [email_address ?? '', Validators.email],
            contact_number: [contact_number ?? ''],
            organization_name: [organization_name ?? ''],
        });
    }

    saveFormValue() {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.application();
        this.applicationSignalService.application.set({
            ...currentApplication,
            references: [...value.references],
        });
    }

    handleSave() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
            this.applicationSignalService.submitSave.set(true);
        }
    }

    handleBack() {
        this.saveFormValue();
        this.applicationSignalService.navigateBack();
    }
}
