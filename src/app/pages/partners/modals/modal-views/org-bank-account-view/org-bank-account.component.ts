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
    ) { }

    ngOnInit() {
        this.setForm();
    }

    setForm() {
        const appFiscalSponsor = this.partner?.partner_fiscal_sponsor;
        const organization = this.partner?.organization;
        const partnerOrgBank = organization?.partner_organization_bank;
        const partnerOrgOtherInfo = organization?.partner_organization_other_information;

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
            swift_code: [appFiscalSponsor?.swift_code ?? ''],
            partner_organization_bank: this.formBuilder.group({
                account_name: [partnerOrgBank?.account_name ?? ''],
                account_number: [partnerOrgBank?.account_number ?? ''],
                bank_branch: [partnerOrgBank?.bank_branch ?? ''],
                bank_name: [partnerOrgBank?.bank_name ?? ''],
                bank_address: [partnerOrgBank?.bank_address ?? ''],
                swift_code: [partnerOrgBank?.swift_code ?? ''],
            }),
            partner_organization_other_information: this.formBuilder.group({
                has_project: [partnerOrgOtherInfo?.has_project ?? false],
                has_financial_policy: [partnerOrgOtherInfo?.has_financial_policy ?? false],
                has_financial_policy_no_reason: [partnerOrgOtherInfo?.has_financial_policy_no_reason ?? ''],
                has_financial_system: [partnerOrgOtherInfo?.has_financial_system ?? false],
                has_financial_system_no_reason: [partnerOrgOtherInfo?.has_financial_system_no_reason ?? ''],
                audit_financial_available: [partnerOrgOtherInfo?.audit_financial_available ?? false],
                has_reviewed_financial_system: [partnerOrgOtherInfo?.has_reviewed_financial_system ?? false],
                recommendation: [partnerOrgOtherInfo?.recommendation ?? ''],
            }),
        });
    }

    get f() {
        return this.form.controls;
    }

    onChangeSelectedBoolOpt(value: string, key: string) {
        this.form.controls?.['partner_organization_other_information']
            ?.get(key)
            ?.setValue(value === 'true' ? true : false);
    }

    saveFiscalSponsorForm() {
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
                        const savedData = {
                            ...this.partner,
                            partner_fiscal_sponsor: {
                                ...data,
                            },
                        };
                        this.savePartnerOrgBank(savedData);
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

    savePartnerOrgBank(data: PartnerForm) {
        this.processing = true;
        const partner = data;
        const { value } = this.form;
        const orgBankAccountValue = value?.partner_organization_bank;
        this.applicationService
            .savePartnerOrgBank({
                pk: this.partner?.organization?.partner_organization_bank?.pk,
                partner_organization_pk: this.partner?.organization?.pk,
                ...orgBankAccountValue,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        const savedData = {
                            ...partner,
                            organization: {
                                ...partner?.organization,
                                partner_organization_bank: {
                                    ...data,
                                },
                            },
                        };

                        this.savePartnerOtherInfoForm(savedData);
                        this.toastr.success('Organization Bank Account has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Organization Bank Account. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Organization Bank Account. ${statusCode} ${errorMessage} Please try again.`,
                        'ERROR!'
                    );
                    this.processing = false;
                },
            });
    }

    savePartnerOtherInfoForm(data: PartnerForm) {
        this.processing = true;
        const partner = data;
        const { value } = this.form;
        const orgOtherInfo = value?.partner_organization_other_information;
        this.applicationService
            .savePartnerOtherInfo({
                pk: this.partner?.organization?.partner_organization_other_information?.pk,
                partner_organization_pk: this.partner?.organization?.pk,
                ...orgOtherInfo,
            })
            .subscribe({
                next: (res: any) => {
                    const data = res?.data;
                    const status = res.status;
                    if (status) {
                        this.bsModalRef.onHidden?.next({
                            isSaved: true,
                            data: {
                                ...partner,
                                organization: {
                                    ...partner?.organization,
                                    partner_organization_other_information: {
                                        ...data,
                                    },
                                },
                            },
                        } as OnHiddenData);
                        this.bsModalRef.hide();
                        this.toastr.success('Other Information has been successfully saved', 'SUCCESS!');
                    } else {
                        this.toastr.error(
                            `An error occurred while saving Other Information. Please try again.`,
                            'ERROR!'
                        );
                    }
                    this.processing = false;
                },
                error: (err) => {
                    const { statusCode, errorMessage } = extractErrorMessage(err);
                    this.toastr.error(
                        `An error occurred while saving Other Information. ${statusCode} ${errorMessage} Please try again.`,
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
            this.saveFiscalSponsorForm();
        }
    }
}
