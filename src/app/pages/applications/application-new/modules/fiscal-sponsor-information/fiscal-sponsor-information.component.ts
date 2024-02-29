import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

@Component({
    selector: 'app-fiscal-sponsor-information',
    templateUrl: './fiscal-sponsor-information.component.html',
    styleUrls: ['./fiscal-sponsor-information.component.scss'],
})
export class FiscalSponsorInformationComponent {
    form: FormGroup;
    submitted: boolean = false;
    applicationSignalService = inject(ApplicationSignalService);

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.setForm();
    }

    setForm() {
        const currentApplication = this.applicationSignalService.application();
        this.form = this.formBuilder.group({
            name: [currentApplication?.fiscal_sponsor?.name ?? ''],
            address: [currentApplication?.fiscal_sponsor?.address ?? ''],
            contact_number: [currentApplication?.fiscal_sponsor?.contact_number ?? ''],
            email_address: [currentApplication?.fiscal_sponsor?.email_address ?? '', Validators.email],
            head: [currentApplication?.fiscal_sponsor?.head ?? ''],
            person_in_charge: [currentApplication?.fiscal_sponsor?.person_in_charge ?? ''],
            bank_account_name: [currentApplication?.fiscal_sponsor?.bank_account_name ?? ''],
            account_number: [currentApplication?.fiscal_sponsor?.account_number ?? ''],
            bank_name: [currentApplication?.fiscal_sponsor?.bank_name ?? ''],
            bank_branch: [currentApplication?.fiscal_sponsor?.bank_branch ?? ''],
            bank_address: [currentApplication?.fiscal_sponsor?.bank_address ?? ''],
        });
    }

    get f() {
        return this.form.controls;
    }

    saveFormValue() {
        const { value } = this.form;
        const currentApplication = this.applicationSignalService.application();
        this.applicationSignalService.application.set({
            ...currentApplication,
            fiscal_sponsor: {
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
