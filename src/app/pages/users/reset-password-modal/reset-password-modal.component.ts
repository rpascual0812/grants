import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { ClipboardService } from 'ngx-clipboard';

import * as _ from '../../../utilities/globals';
import { UserService } from 'src/app/services/user.service';
@Component({
    selector: 'app-reset-password-modal',
    templateUrl: './reset-password-modal.component.html',
    styleUrls: ['./reset-password-modal.component.scss']
})
export class ResetPasswordModalComponent {
    public callback: EventEmitter<any> = new EventEmitter();
    loading: boolean = false;
    title?: string;
    saveBtnName?: string;
    closeBtnName?: string;
    password: any = '';
    url: String = _.BASE_URL;
    user: any = {};
    filters: any = {};
    isProducer: boolean = false;
    profilePicture: String = _.BASE_URL + '/assets/images/user.png';

    isValid: boolean = false;


    dateConfig: any = { isAnimated: true, containerClass: 'theme-dark-blue', dateInputFormat: 'YYYY/MM/DD' };

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private clipboardService: ClipboardService,
        private userService: UserService,
    ) { }

    ngOnInit(): void {
        this.filters = {
            search: '',
            skip: 0,
            take: 10
        };
    }

    submit() {
        // this.callback.emit({});
        // this.bsModalRef.hide();
        this.user.account.new_password = this.password;
        this.userService
            .resetPassword(this.user.account)
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

    sendPasswordResetEmail(user: any) {
        _.confirmMessage({
            title: '<strong>Are you sure you want to send a password reset email? This will invalidate the current password of ' + this.user.first_name + ' </strong>',
            icon: 'question',
            buttons: {
                showClose: true,
                showCancel: true,
                focusConfirm: false
            },
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Send',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel'
        }, () => {
            this.userService
                .sendUserResetPassword(user)
                .subscribe({
                    next: (data: any) => {
                        this.toastr.success('An email has been successfully sent to ' + this.user.first_name, 'SUCCESS!');
                    },
                    error: (error: any) => {
                        console.log(error);
                    },
                    complete: () => {
                        this.bsModalRef.hide();
                    }
                });
        });
    }

    setPassword(evt: any) {
        this.isValid = true;
        if (evt.password.replace(/\s/g, '') === "") {
            this.isValid = false;
        }

        this.password = evt.password;
    }
}
