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

    submitted: boolean = false;
    form: FormGroup;

    letters: any = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    numbers: any = "0123456789";
    ilo: any = "iloIO";
    special: any = "!@#$%^&*()_+~\`|}{[]:;?><,./-=";

    range: any = 6;
    checkboxes: any = {
        letters: true,
        numbers: true,
        ilo: true,
        special: true
    }
    copied: boolean = false;


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

        this.setForm();
        this.generatePassword();
    }

    setForm() {
        this.form = this.formBuilder.group({
            password: ['', Validators.required],
        });
    }

    get f() { return this.form.controls; }

    submit() {
        this.callback.emit({});
        this.bsModalRef.hide();
    }

    generatePassword() {
        this.copied = false;
        var chars = "";

        Object.keys(this.checkboxes).forEach((checkbox: any) => {
            switch (checkbox) {
                case 'letters':
                    if (this.checkboxes[checkbox]) {
                        chars += this.letters;
                    }
                    break;
                case 'numbers':
                    if (this.checkboxes[checkbox]) {
                        chars += this.numbers;
                    }
                    break;
                case 'ilo':
                    if (this.checkboxes[checkbox]) {
                        chars += this.ilo;
                    }
                    break;
                case 'special':
                    if (this.checkboxes[checkbox]) {
                        chars += this.special;
                    }
                    break;

                default:
                    break;
            }
        });

        var passwordLength = this.range;
        var password = "";

        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber + 1);
        }

        this.form.patchValue({ password });
    }

    copyPassword() {
        this.copied = true;
        this.clipboardService.copyFromContent(this.form.value.password);
    }

    sendPasswordResetEmail(user: any) {
        this.userService
            .sendUserResetPassword(user)
            .subscribe({
                next: (data: any) => {

                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    this.bsModalRef.hide();
                }
            });


    }
}
