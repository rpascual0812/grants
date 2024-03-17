import { Component, EventEmitter, ViewChild } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
import { SelectComponent } from '../select/select.component';

@Component({
    selector: 'app-link-generator',
    templateUrl: './link-generator.component.html',
    styleUrls: ['./link-generator.component.scss']
})
export class LinkGeneratorComponent {
    @ViewChild(SelectComponent) select: SelectComponent;
    public callback: EventEmitter<any> = new EventEmitter();
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

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private applicationService: ApplicationService,
        private toastr: ToastrService
    ) { }

    get f() { return this.form.controls; }

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
            partner_pk: [this.partner_pk, Validators.required],
            partner_name: [this.partner_name, Validators.required],
        });
    }

    partnerSelected(event: any) {
        this.form.get('partner_pk')?.patchValue(event[0].pk);
        this.partner_pk = event[0].pk;
    }

    submit() {
        this.submitted = true;

        this.applicationService
            .generate(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.callback.emit({ data });
                    this.toastr.success('The link has been successfully sent to ' + this.form.value.email_address, 'SUCCESS!');
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while sending the link. Please try again', 'ERROR!');
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    this.reset();
                    this.select.reset();
                    setTimeout(() => { this.loading = false; }, 500);
                    this.bsModalRef.hide();
                }
            });
    }
}
