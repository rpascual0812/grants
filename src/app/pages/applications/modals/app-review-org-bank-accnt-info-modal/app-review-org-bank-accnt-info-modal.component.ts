import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Application, PartnerOrganizationBank } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';

type IsHidden = 'yes' | 'no';

const NUMBER_OF_REQUIRED_FIELDS = 6;

@Component({
    selector: 'app-app-review-org-bank-accnt-info-modal',
    templateUrl: './app-review-org-bank-accnt-info-modal.component.html',
    styleUrls: ['./app-review-org-bank-accnt-info-modal.component.scss'],
})
export class AppReviewOrgBankAccntInfoModalComponent {
    @Output() callback = new EventEmitter<any>();

    filters: any = {};
    form: FormGroup;
    bank_account: PartnerOrganizationBank | undefined = undefined;
    currentApplication: Application = {};
    action: string = 'view';

    loading: boolean = false;
    submitted: boolean = false;
    isHidden: IsHidden = 'no';

    constructor(
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.setForm();
        this.validateFormValues();
        this.determineRequiredFields();
    }

    setForm() {
        this.bank_account = this.currentApplication?.partner?.organization?.partner_organization_bank;
        this.form = this.formBuilder.group({
            account_name: [this.bank_account?.account_name ?? ''],
            account_number: [this.bank_account?.account_number ?? ''],
            bank_name: [this.bank_account?.bank_name ?? ''],
            bank_branch: [this.bank_account?.bank_branch ?? ''],
            bank_address: [this.bank_account?.bank_address ?? ''],
            swift_code: [this.bank_account?.swift_code ?? ''],
        });
    }

    determineRequiredFields() {
        const { value: formValue } = this.form;
        if (this.isHidden === 'no') {
            Object.keys(formValue).forEach((key) => this.addValidators(key));
        } else {
            Object.keys(formValue).forEach((key) => this.removeValidators(key));
        }
    }

    addValidators(key: string) {
        this.form.controls[key]?.addValidators(Validators?.required);
        this.form.controls[key]?.updateValueAndValidity();
    }

    removeValidators(key: string) {
        this.form?.controls?.[key]?.setErrors(null);
        this.form?.controls?.[key]?.clearValidators();
        this.form?.controls?.[key]?.updateValueAndValidity();
    }

    validateFormValues() {
        const { value: formValue } = this.form;
        const ObjToArr = Object.keys(formValue).filter(
            (key) => !formValue?.[key] || (formValue?.[key] ?? '').trim() === ''
        );
        if (NUMBER_OF_REQUIRED_FIELDS === ObjToArr?.length) {
            this.isHidden = 'yes';
        }
    }

    get f() {
        return this.form.controls;
    }

    handleOnIsHidden(isHidden: string) {
        this.isHidden = isHidden as IsHidden;
        const { value: formValue } = this.form;
        if (this.isHidden === 'yes') {
            Object.keys(formValue).forEach((key) => this.removeValidators(key));
            Object.keys(formValue).forEach((key) => this.form?.controls?.[key].setValue(''));
        } else {
            Object.keys(formValue).forEach((key) => this.addValidators(key));
        }
    }

    submit() {
        this.loading = true;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        const bankAccount = {
            partner_organization_pk: this.currentApplication?.partner?.organization?.pk,
            pk: this.bank_account?.pk,
            ...this.form.value,
        };

        this.save(bankAccount);
    }

    save(bankAccount: PartnerOrganizationBank) {
        this.applicationService.savePartnerOrgBank(bankAccount).subscribe({
            next: (data: any) => {
                this.callback.emit({ ...bankAccount });
                this.toastr.success(
                    'The Organizational Bank Account Information has been successfully ' +
                        (bankAccount?.pk ? 'updated' : 'added'),
                    'SUCCESS!'
                );
            },
            error: (error: any) => {
                console.log(error);
                this.toastr.error(
                    'An error occurred while updating the Organizational Bank Account Information. Please try again',
                    'ERROR!'
                );
                setTimeout(() => {
                    this.loading = false;
                }, 500);
            },
            complete: () => {
                console.log('Complete');
                setTimeout(() => {
                    this.loading = false;
                }, 500);
                this.bsModalRef.hide();
            },
        });
    }
}
