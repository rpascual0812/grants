import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import * as _ from '../../../utilities/globals';

@Component({
    selector: 'app-users-modal',
    templateUrl: './users-modal.component.html',
    styleUrls: ['./users-modal.component.scss']
})
export class UsersModalComponent {

    public callback: EventEmitter<any> = new EventEmitter();
    loading: boolean = false;
    title?: string;
    saveBtnName?: string;
    closeBtnName?: string;
    activateBtnName?: string;
    user: any = {};
    genders: any = [];
    roles: any = [];
    provinces: any = [];
    cities: any = [];
    areas: any = [];
    url: String = _.BASE_URL;
    filters: any = {};
    isProducer: boolean = false;
    profilePicture: String = _.BASE_URL + '/assets/images/user.png';

    submitted: boolean = false;
    form: FormGroup;

    dateConfig: any = { isAnimated: true, containerClass: 'theme-dark-blue', dateInputFormat: 'YYYY/MM/DD' };

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService
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
        this.user.birthdate = new Date(this.user.birthdate);
        this.profilePicture = '';  //this.user ? this.url + '/' + this.user.user_document.document.path : this.profilePicture;

        this.form = this.formBuilder.group({
            pk: [''],
            first_name: [this.user ? this.user.first_name : '', Validators.required],
            last_name: [this.user ? this.user.last_name : '', Validators.required],
            mobile: [this.user ? this.user.mobile_number : '', Validators.required],
            email_address: [this.user ? this.user.email_address : '', Validators.required],
            birthdate: [this.user ? new Date(this.user.birthdate) : '', Validators.required],
            gender: [this.user ? this.user.gender_pk : '', Validators.required],
            archived: [false]
        });
    }

    get f() { return this.form.controls; }

    submit() {
        this.callback.emit({});
        this.bsModalRef.hide();
    }

    activate() {

    }
}
