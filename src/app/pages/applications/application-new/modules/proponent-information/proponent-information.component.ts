import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Partner } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

@Component({
    selector: 'app-proponent-information',
    templateUrl: './proponent-information.component.html',
    styleUrls: ['./proponent-information.component.scss'],
})
export class ProponentInformationComponent {
    initialLoading = true;
    form: FormGroup;
    submitted: boolean = false;
    applicationSignalService = inject(ApplicationSignalService);

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {}

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

    saveFormValue() {
        const currentApplication = this.applicationSignalService.appForm();
        const { value } = this.form;
        this.applicationService
            .saveApplicationPartner({
                partner_id: value.partner_id,
                name: value.name,
                address: value.address,
                contact_number: value.contact_number,
                website: value.website,
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
                    const data = res?.data as Partner;
                    this.applicationSignalService.appForm.set({
                        ...currentApplication,
                        partner: {
                            ...data,
                            organization: {
                                ...currentApplication?.partner?.organization
                            }
                        },
                    });
                    this.toastr.success('Proponent Information has been successfully saved', 'SUCCESS!');
                    this.applicationSignalService.navigateNext();
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
