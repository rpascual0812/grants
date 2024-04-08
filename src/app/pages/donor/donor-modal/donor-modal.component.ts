import { Component, EventEmitter, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import * as _ from '../../../utilities/globals';
import { GenderService } from 'src/app/services/gender.service';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { UserService } from 'src/app/services/user.service';
import { DonorService } from 'src/app/services/donor.service';

@Component({
    selector: 'app-donor-modal',
    templateUrl: './donor-modal.component.html',
    styleUrls: ['./donor-modal.component.scss']
})
export class DonorModalComponent {
    public callback: EventEmitter<any> = new EventEmitter();

    onFocus: Function = _.onFocus;
    onExit: Function = _.onExit;

    title?: string;
    donor: any = {};

    loading: boolean = false;
    saveBtnName?: string;
    closeBtnName?: string;
    activateBtnName?: string;
    genders: any = [];
    provinces: any = [];
    cities: any = [];
    areas: any = [];
    url: String = _.BASE_URL;
    filters: any = {};
    profilePicture: String = _.BASE_URL + '/assets/images/user.png';

    submitted: boolean = false;
    form: FormGroup;
    image: any = {};

    dateConfig: any = { isAnimated: true, containerClass: 'theme-dark-blue', dateInputFormat: 'YYYY/MM/DD' };

    constructor(
        private elRef: ElementRef,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        public documentUploaderRef: BsModalRef,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private genderService: GenderService,
        private donorService: DonorService
    ) { }

    ngOnInit(): void {
        console.log(this.donor);
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
            name: [this.donor ? this.donor.name : '', Validators.required],
            code: [this.donor ? this.donor.code : ''],
            active: [this.donor ? this.donor.active : true],
            archived: [false],
        });
    }

    get f() { return this.form.controls; }

    submit() {
        this.loading = true;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.form.get('pk')?.patchValue(this.donor.pk);

        this.donorService
            .save(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.callback.emit({ data });
                    this.toastr.success('The user has been successfully ' + (this.donor.pk ? 'updated' : 'added'), 'SUCCESS!');
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
