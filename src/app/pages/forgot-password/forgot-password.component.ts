import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as _ from '../../utilities/globals';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    form: FormGroup;
    isSubmitted: boolean = false;
    year: any;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required]],
        });

        this.year = moment().year();
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.isSubmitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            console.log('form is invalid');
            return;
        }

        this.authService.forgot({ email: this.form.value.email, url: window.location.origin, device: 'web' })
            .subscribe({
                next: (data: any) => {
                    _.successMessage('An email has been sent to ' + this.form.value.email + '!');
                },
                error: (error: any) => {
                    _.errorMessage('The email address you provided was not found!');
                    setTimeout(() => { this.isSubmitted = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.isSubmitted = false; }, 500);
                }
            });
    }
}
