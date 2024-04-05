import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Partner } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';

@Component({
    selector: 'app-proponent-information',
    templateUrl: './proponent-information.component.html',
    styleUrls: ['./proponent-information.component.scss'],
})
export class ProponentInformationComponent {
    initialLoading = true;
    form: FormGroup;
    submitted: boolean = false;
    processing: boolean = false;
    applicationSignalService = inject(ApplicationSignalService);

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) { }

    appFormEffect = effect(() => {
        this.initialLoading = this.applicationSignalService.loadingInitialAppForm();
        if (!this.initialLoading) {
            this.setForm();
        }
    });

    get f() {
        return this.form.controls;
    }

    setForm() {
        const currentApplication = this.applicationSignalService.appForm();
        const contact = currentApplication?.partner?.contacts?.at(0);
        const partnerId = currentApplication?.partner?.partner_id;
        this.form = this.formBuilder.group({
            partner_id: [partnerId],
            name: [currentApplication?.partner?.name ?? '', Validators.required],
            address: [currentApplication?.partner?.address ?? '', Validators.required],
            contact_number: [currentApplication?.partner?.contact_number ?? '', Validators.required],
            email_address: [currentApplication?.partner?.email_address ?? '', Validators.email],
            website: [currentApplication?.partner?.website ?? ''],
            contact_person_name: [contact?.name ?? '', Validators.required],
            contact_person_number: [contact?.contact_number ?? '', Validators.required],
            contact_person_email_address: [contact?.email_address ?? '', [Validators.required, Validators.email]],
        });
    }

    saveCurrentAppForm(data: Partner) {
        const currentApplication = this.applicationSignalService.appForm();
        const partner = currentApplication?.partner
        this.applicationSignalService.appForm.set({
            ...currentApplication,
            partner: {
                ...partner,
                ...data,
            },
        });
    }


    saveFormValue() {
        this.processing = true;
        const currentApplication = this.applicationSignalService.appForm();
        const partnerId = currentApplication?.partner?.partner_id;
        const { value } = this.form;
        this.applicationService
            .saveApplicationPartner({
                partner_id: partnerId,
                name: value.name,
                address: value.address,
                contact_number: value.contact_number,
                website: value.website,
                email_address: value?.email_address,
                contacts: [
                    {
                        name: value.contact_person_name,
                        contact_number: value.contact_person_number,
                        email_address: value.contact_person_email_address,
                    },
                ],
            })
            .subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data as Partner;
                    if (status) {
                        this.saveCurrentAppForm(data)
                        this.toastr.success('Proponent Information has been successfully saved', 'SUCCESS!');
                        this.applicationSignalService.navigateNext();
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Proponent Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Proponent Information. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    handleNext() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
        }
    }

    handleResetForm() {
        this.form.reset();
    }
}
