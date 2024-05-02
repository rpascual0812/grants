import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
import { SelectComponent } from '../select/select.component';
import { LinkGeneratorSignalService } from 'src/app/services/link-generator.signal.service';

@Component({
    selector: 'app-link-generator',
    templateUrl: './link-generator.component.html',
    styleUrls: ['./link-generator.component.scss'],
})
export class LinkGeneratorComponent {
    @ViewChild(SelectComponent) select: SelectComponent;
    @Output() callback: EventEmitter<any> = new EventEmitter();
    loading: boolean = false;
    title?: string;
    saveBtnName?: string;
    closeBtnName?: string;
    activateBtnName?: string;

    form: FormGroup;

    uuid: string = '';
    link: string = '';
    email_address: string = '';
    partner_pk: number = 0;
    partner_name: string = '';

    submitted: boolean = false;

    linkGeneratorSignalService = inject(LinkGeneratorSignalService);

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) {}

    get f() {
        return this.form.controls;
    }

    ngOnInit(): void {
        this.setForm();
    }

    reset() {
        this.email_address = '';
        this.form.get('partner_pk')?.patchValue(0);
        this.partner_name = '';
        this.form.reset();
        this.setForm();
    }

    setForm() {
        this.uuid = uuidv4();
        this.link = window.location.origin + '/public/application/' + this.uuid;

        this.form = this.formBuilder.group({
            pk: [''],
            uuid: [this.uuid, Validators.required],
            link: [this.link, Validators.required],
            email_address: [this.email_address, Validators.required],
            partner_pk: [this.partner_pk],
            partner_name: [this.partner_name, Validators.required],
        });
    }

    partnerSelected(event: any) {
        const name = event.at(0)?.name ?? '';
        const formName = name === 'New' ? '' : name;
        const partnerPk = event.at(0)?.pk;
        this.form.get('partner_pk')?.patchValue(partnerPk);
        this.form.get('partner_name')?.patchValue(formName);
        this.partner_pk = partnerPk;
    }

    submit() {
        this.submitted = true;
        this.loading = true;
        const { valid } = this.form;
        if (valid) {
            this.applicationService.generate(this.form.value).subscribe({
                next: (res: any) => {
                    const status = res?.status;
                    const data = res?.data;
                    if (status) {
                        this.callback.emit({ data });
                        this.toastr.success(
                            `The link has been successfully sent to ${this.form.value?.email_address ?? ''}`,
                            'SUCCESS!'
                        );
                    } else {
                        this.toastr.error('An error occurred while sending the link. Please try again', 'ERROR!');
                    }
                    this.loading = false;
                },
                error: (error: any) => {
                    this.loading = false;
                    this.toastr.error('An error occurred while sending the link. Please try again', 'ERROR!');
                },
                complete: () => {
                    this.reset();
                    this.select.reset();
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                    this.bsModalRef.hide();
                },
            });
        }
        this.loading = false;
    }
}
