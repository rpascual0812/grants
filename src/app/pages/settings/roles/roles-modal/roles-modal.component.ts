import { Component, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import * as _ from '../../../../utilities/globals';
import { RoleService } from 'src/app/services/roles.service';

@Component({
    selector: 'app-roles-modal',
    templateUrl: './roles-modal.component.html',
    styleUrls: ['./roles-modal.component.scss']
})
export class RolesModalComponent {
    public callback: EventEmitter<any> = new EventEmitter();

    onFocus: Function = _.onFocus;
    onExit: Function = _.onExit;

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
        private roleService: RoleService
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
            details: [this.role ? this.role.details : ''],
        });
    }

    get f() { return this.form.controls; }

    submit() {
        this.loading = true;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.form.get('pk')?.patchValue(this.role.pk);

        this.roleService
            .save(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.callback.emit({ data });
                    this.toastr.success('The role has been successfully ' + (this.form.value.pk ? 'updated' : 'added'), 'SUCCESS!');
                },
                error: (error: any) => {
                    console.log(error);
                    this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                    this.bsModalRef.hide();
                }
            });
    }
}
