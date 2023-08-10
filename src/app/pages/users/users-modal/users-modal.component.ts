import { Component, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import * as _ from '../../../utilities/globals';
import { GenderService } from 'src/app/services/gender.service';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { UserService } from 'src/app/services/user.service';

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
        private cdr: ChangeDetectorRef,
        private genderService: GenderService,
        private userService: UserService
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
        this.profilePicture = this.user && this.user.user_document ? this.url + '/' + this.user.user_document.document.path : './assets/images/default-profile.png';

        this.user = this.user ? this.user : {
            user_role: []
        };

        this.user.user_role.forEach((user_role: any) => {
            this.roles.filter((role: any) => {
                if (role.pk == user_role.role_pk) {
                    role.checked = true;
                }
            });
        });

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
            roles: ['']
        });

        // console.log('init user', this.user, this.profilePicture);
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
        this.loading = true;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        const activeRoles = this.roles.filter((role: any) => role.checked == true);

        let formattedDate = formatDate(this.form.value.birthdate, 'yyyy-MM-dd', "en-US");
        this.form.get('birthdate')?.patchValue(formattedDate);
        this.form.get('pk')?.patchValue(this.user.pk);
        this.form.get('image')?.patchValue(this.user.user_document);
        this.form.get('roles')?.patchValue(activeRoles);

        this.userService
            .save(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.callback.emit({ data });
                    this.toastr.success('The user has been successfully ' + (this.user.pk ? 'updated' : 'added'), 'SUCCESS!');
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
