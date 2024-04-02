import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
import { PartnerForm } from 'src/app/services/partner.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { OnHiddenData } from '../../../partner-view/partner-view.component';

@Component({
    selector: 'app-org-bank-account',
    templateUrl: './org-bank-account.component.html',
    styleUrls: ['./org-bank-account.component.scss'],
})
export class OrgBankAccountComponent implements OnInit {
    @Input() partner: PartnerForm | null = null;
    processing = false;
    submitted = false;
    form: FormGroup;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.setForm();
    }

    setForm() {
        const appFiscalSponsor = this.partner?.partner_fiscal_sponsor;
        this.form = this.formBuilder.group({
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

    saveFormValue() {
        this.processing = true;
        const partnerFiscalSponsor = this.partner?.partner_fiscal_sponsor;
        const { value } = this.form;
        this.applicationService
            .saveApplicationFiscalSponsor({
                partner_pk: this.partner?.pk,
                pk: partnerFiscalSponsor?.pk,
                ...value,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                ...this.partner,
                                partner_fiscal_sponsor: {
                                    ...data,
                                },
                            },
                        } as OnHiddenData);
                        this.bsModalRef.hide();
                        this.toastr.success('Fiscal Sponsor Information has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Fiscal Sponsor Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Fiscal Sponsor. ${statusCode} ${errorMessage} Please try again.`,
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
            this.saveFormValue();
        }
    }
}
