import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
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

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.setForm();
    }

    setForm() {
        const currentApplication = this.applicationSignalService.appForm();
        const appFiscalSponsor = currentApplication?.application_fiscal_sponsor;
        this.form = this.formBuilder.group({
            application_pk: [currentApplication?.pk],
            pk: [appFiscalSponsor?.pk],
            name: [appFiscalSponsor?.name ?? ''],
            address: [appFiscalSponsor?.address ?? ''],
            contact_number: [appFiscalSponsor?.contact_number ?? ''],
            email_address: [appFiscalSponsor?.email_address ?? '', Validators.email],
            head: [appFiscalSponsor?.head ?? ''],
            person_in_charge: [appFiscalSponsor?.person_in_charge ?? ''],
            bank_account_name: [appFiscalSponsor?.bank_account_name ?? ''],
            account_number: [appFiscalSponsor?.account_number ?? ''],
            bank_name: [appFiscalSponsor?.bank_name ?? ''],
            bank_branch: [appFiscalSponsor?.bank_branch ?? ''],
            bank_address: [appFiscalSponsor?.bank_address ?? ''],
        });
    }

    get f() {
        return this.form.controls;
    }

    saveFormValue(isNavigateNext?: boolean) {
        const currentApplication = this.applicationSignalService.appForm();
        const { value } = this.form;
        this.applicationService
            .saveApplicationFiscalSponsor({
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.applicationSignalService.appForm.set({
                            ...currentApplication,
                            application_fiscal_sponsor: {
                                ...data,
                            },
                        });

                        this.toastr.success('Fiscal Sponsor Information has been successfully saved', 'SUCCESS!');

                        if (isNavigateNext) {
                            this.applicationSignalService.navigateNext();
                        } else {
                            this.applicationSignalService.navigateBack();
                        }
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Fiscal Sponsor Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                },
                error: (err) => {
                    const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                    const statusCode = err?.status ? `status: ${err?.status}` : '';
                    this.toastr.error(
                        `An error occurred while saving Fiscal Sponsor. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                },
            });
    }

    handleReset() {
        this.form.reset();
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
