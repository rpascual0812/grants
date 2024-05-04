import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Application, PartnerOrganizationBank } from 'src/app/interfaces/_application.interface';
import { ApplicationService } from 'src/app/services/application.service';

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
    isHidden: string = 'no';

    constructor(
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.setForm();
    }

    setForm() {
        this.bank_account = this.currentApplication?.partner?.organization?.partner_organization_bank;
        this.form = this.formBuilder.group({
            pk: [this.bank_account?.pk ?? ''],
            partner_organization_pk: [this.currentApplication?.partner?.organization?.pk ?? ''],
            account_name: [this.bank_account?.account_name ?? '', Validators.required],
            account_number: [this.bank_account?.account_number ?? '', Validators.required],
            bank_name: [this.bank_account?.bank_name ?? '', Validators.required],
            bank_branch: [this.bank_account?.bank_branch ?? '', Validators.required],
            bank_address: [this.bank_account?.bank_address ?? '', Validators.required],
            swift_code: [this.bank_account?.swift_code ?? '', Validators.required],
        });
    }

    get f() {
        return this.form.controls;
    }

    submit() {
        this.loading = true;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.form.get('pk')?.patchValue(this.bank_account?.pk);

        const bankAccount = {
            partner_organization_pk: this.currentApplication?.partner?.organization?.pk,
            pk: this.bank_account?.pk,
            ...this.form.value,
        }

        this.applicationService.savePartnerOrgBank(this.form.value).subscribe({
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
