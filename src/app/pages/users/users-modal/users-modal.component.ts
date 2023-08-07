import { Component, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import * as _ from '../../../utilities/globals';
import { DateTime } from 'luxon';
import { GenderService } from 'src/app/services/gender.service';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';

@Component({
    selector: 'app-users-modal',
    templateUrl: './users-modal.component.html',
    styleUrls: ['./users-modal.component.scss']
})
export class UsersModalComponent {

    public callback: EventEmitter<any> = new EventEmitter();

    title?: string;
    user: any = {};
    roles: any = [];

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
    isProducer: boolean = false;
    profilePicture: String = _.BASE_URL + '/assets/images/user.png';

    submitted: boolean = false;
    form: FormGroup;
    image: any = {};

    dateConfig: any = { isAnimated: true, containerClass: 'theme-dark-blue', dateInputFormat: 'YYYY/MM/DD' };

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        public documentUploaderRef: BsModalRef,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private genderService: GenderService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.filters = {
            search: '',
            skip: 0,
            take: 10
        };

        this.setForm();
        this.getGenders();
    }

    setForm() {
        this.profilePicture = this.user ? this.user + '/' + this.user.user_document.document.path : './assets/images/default-profile.png';

        this.user = this.user ? this.user : {
            user_role: []
        };

        this.user.birthdate = new Date(this.user.birthdate ? this.user.birthdate : DateTime.now());
        this.form = this.formBuilder.group({
            pk: [''],
            first_name: [this.user ? this.user.first_name : '', Validators.required],
            last_name: [this.user ? this.user.last_name : '', Validators.required],
            mobile: [this.user ? this.user.mobile_number : '', Validators.required],
            email_address: [this.user ? this.user.email_address : '', Validators.required],
            birthdate: [this.user ? new Date(this.user.birthdate) : '', Validators.required],
            gender: [this.user ? this.user.gender_pk : '', Validators.required],
            archived: [false],
            image: [''],
        });
    }

    get f() { return this.form.controls; }

    getGenders() {
        this.genderService
            .fetchAll(this.filters)
            .subscribe({
                next: (data: any) => {
                    this.genders = data.data;
                },
                error: (error: any) => {
                    console.log(error);
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                }
            });
    }

    getActiveRoles() {
        const active_roles = this.roles.filter((role: any) => role.checked == true);
        return active_roles.length;
    }

    updateRole(i: any, evt: any) {
        this.roles[i].checked = evt.target.checked;
        evt.stopPropagation();
    }

    submit() {
        this.callback.emit({});
        this.bsModalRef.hide();
    }

    uploadFiles() {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.user.user_document = res.file;
            this.profilePicture = this.url + '/' + this.user.user_document.path;

            this.cdr.detectChanges();
        });
    }
}
