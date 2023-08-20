import { Component, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-roles-modal',
    templateUrl: './roles-modal.component.html',
    styleUrls: ['./roles-modal.component.scss']
})
export class RolesModalComponent {
    public callback: EventEmitter<any> = new EventEmitter();

    title?: string;
    role: any = {};

    loading: boolean = false;
    saveBtnName?: string;
    closeBtnName?: string;
    activateBtnName?: string;

    filters: any = {};
    submitted: boolean = false;
    form: FormGroup;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.filters = {
            search: '',
            skip: 0,
            take: 10
        };

        this.setForm();
    }

    setForm() {
        this.form = this.formBuilder.group({
            pk: [''],
            name: [this.role ? this.role.name : '', Validators.required],
            details: [this.role ? this.role.details : '', Validators.required],
        });
    }

    get f() { return this.form.controls; }

    submit() {
        this.loading = true;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }
    }
}
