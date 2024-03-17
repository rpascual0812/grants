import { Component, EventEmitter, inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/services/application.service';
import { LinkGeneratorRefetchKey, LinkGeneratorSignalService } from 'src/app/services/link-generator.signal.service';

@Component({
    selector: 'app-link-generator',
    templateUrl: './link-generator.component.html',
    styleUrls: ['./link-generator.component.scss'],
})
export class LinkGeneratorComponent {
    public callback: EventEmitter<any> = new EventEmitter();
    refetchKey: string = '';
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
        this.uuid = uuidv4();
        this.link = window.location.origin + '/public/application/' + this.uuid;
        this.setForm();
    }

    setForm() {
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

        this.applicationService.generate(this.form.value).subscribe({
            next: (data: any) => {
                this.callback.emit({ data });

                this.linkGeneratorSignalService.linkGeneratorData.set({
                    data,
                    refetchKey: this.refetchKey as LinkGeneratorRefetchKey,
                });

                this.toastr.success(
                    'The link has been successfully sent to ' + this.form.value.email_address,
                    'SUCCESS!'
                );
            },
            error: (error: any) => {
                console.log(error);
                this.toastr.error('An error occurred while sending the link. Please try again', 'ERROR!');
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
