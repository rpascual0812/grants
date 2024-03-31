import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';
import * as _ from '../../../../../utilities/globals';
import { DocumentService } from 'src/app/services/document.service';
import { PartnerFiscalSponsor } from 'src/app/interfaces/_application.interface';

@Component({
    selector: 'app-fiscal-sponsor-information',
    templateUrl: './fiscal-sponsor-information.component.html',
    styleUrls: ['./fiscal-sponsor-information.component.scss'],
})
export class FiscalSponsorInformationComponent {
    form: FormGroup;
    submitted: boolean = false;
    applicationSignalService = inject(ApplicationSignalService);

    attachments: any = [];
    SERVER: string = _.BASE_URL;

    constructor(
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        private documentService: DocumentService
    ) {}

    ngOnInit() {
        this.setForm();

        const currentApplication = this.applicationSignalService.appForm();
        if (currentApplication?.documents) {
            currentApplication?.documents.forEach((document: any) => {
                if (document.type == 'fiscal_sponsor_information') {
                    this.attachments.push(document);
                }
            });
        }
    }

    setForm() {
        const currentApplication = this.applicationSignalService.appForm();
        const appFiscalSponsor = currentApplication?.partner?.partner_fiscal_sponsor;
        this.form = this.formBuilder.group({
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

    saveCurrentAppForm(data: PartnerFiscalSponsor) {
        const currentApplication = this.applicationSignalService.appForm();
        const partner = currentApplication?.partner;
        const partnerFiscalSponsor = partner?.partner_fiscal_sponsor;
        this.applicationSignalService.appForm.set({
            ...currentApplication,
            partner: {
                ...partner,
                partner_fiscal_sponsor: {
                    ...data,
                    pk: data?.pk ?? partnerFiscalSponsor?.pk,
                },
            },
        });
    }

    saveFormValue() {
        const currentApplication = this.applicationSignalService.appForm();
        const partner = currentApplication?.partner;
        const { value } = this.form;
        this.applicationService
            .saveApplicationFiscalSponsor({
                partner_pk: partner?.pk,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.saveCurrentAppForm(data);
                        this.toastr.success('Fiscal Sponsor Information has been successfully saved', 'SUCCESS!');
                        this.applicationSignalService.navigateNext();
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

    handleNext() {
        this.submitted = true;
        const { status } = this.form;
        if (status === 'VALID') {
            this.saveFormValue();
        }
    }

    handleBack() {
        const { value } = this.form;
        this.saveCurrentAppForm(value);
        this.applicationSignalService.navigateBack();
    }

    saveAttachment(ev: any) {
        const currentApplication = this.applicationSignalService.appForm();
        this.documentService
            .save({
                table_pk: currentApplication?.pk,
                table_name: 'applications',
                document_pk: ev.pk,
                type: 'fiscal_sponsor_information',
            })
            .subscribe({
                next: (data: any) => {
                    this.toastr.success('The document has been successfully uploaded', 'SUCCESS!');
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while uploading the document. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                },
            });
    }
}
