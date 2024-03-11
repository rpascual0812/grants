import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

@Component({
    selector: 'app-proponent-information',
    templateUrl: './proponent-information.component.html',
    styleUrls: ['./proponent-information.component.scss'],
})
export class ProponentInformationComponent {
    form: FormGroup;
    submitted: boolean = false;
    loading: boolean = false;
    applicationSignalService = inject(ApplicationSignalService);

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.setForm();
    }

    get f() {
        return this.form.controls;
    }

    setForm() {
        const currentApplication = this.applicationSignalService.application();
        this.form = this.formBuilder.group({
            name: [currentApplication?.proponent?.name ?? '', Validators.required],
            address: [currentApplication?.proponent?.address ?? '', Validators.required],
            contact_number: [currentApplication?.proponent?.contact_number ?? '', Validators.required],
            email_address: [currentApplication?.proponent?.email_address ?? '', Validators.email],
            website: [currentApplication?.proponent?.website ?? ''],
            contact_person_name: [currentApplication?.proponent?.contact_person_name ?? '', Validators.required],
            contact_person_number: [currentApplication?.proponent?.contact_person_number ?? '', Validators.required],
            contact_person_email_address: [
                currentApplication?.proponent?.contact_person_email_address ?? '',
                [Validators.required, Validators.email],
            ],
        });
    }

    saveFormValue() {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.application();
        this.applicationSignalService.application.set({
            ...currentApplication,
            proponent: {
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

    handleResetForm() {
        this.form.reset();
    }
}
