import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';
import * as _ from '../../utilities/globals';

import { MustMatch, MustValid } from '../../utilities/form.validators';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
    form: FormGroup;
    isSubmitted: boolean = false;
    year: any;
    alert: any = {
        show: false,
        class: 'success'
    }
    success: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirm_password: new FormControl('', [Validators.required, Validators.minLength(6)])
        }, {
            validator: [MustMatch('password', 'confirm_password')]
        });

        this.year = DateTime.now().year;
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        // stop here if form is invalid
        if (this.form.invalid) {
            console.log('form is invalid');
            return;
        }

        this.isSubmitted = true;

        const data = {
            token: this.route.snapshot.params['token'],
            password: this.form.value.password,
            url: _.BASE_URL
        }

        this.authService.reset(data)
            .subscribe({
                next: (data: any) => {
                    this.alert.class = 'success';
                    this.alert.show = true;
                    this.success = true;
                },
                error: (error: any) => {
                    this.delaySubmit();
                    this.alert.class = 'danger';
                    this.alert.show = true;
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.isSubmitted = false; }, 500);
                }
            });
    }

    delaySubmit() {
        setTimeout(() => {
            this.isSubmitted = false;
        }, 2000);
    }
}
