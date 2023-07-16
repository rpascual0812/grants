import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    isSubmitted: boolean = false;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            remember: [false]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.isSubmitted = true;
        console.log('submitted', this.form.value);
        if (this.form.invalid) {
            console.log('form is invalid');
            this.isSubmitted = false;
            return;
        }

        this.authService.login(this.form.value)
            .subscribe({
                next: (data: any) => {
                    const exp = (JSON.parse(atob(data.user.access_token.split('.')[1]))).exp;
                    console.log(moment((exp * 1000)).format('YYYY-MM-DD'));

                    this.authService.setSession(data);
                    this.router.navigateByUrl('/');
                },
                error: (error: any) => {
                    this.toastr.error('An error occurred while fetching your account. Please try again', 'ERROR!');
                    setTimeout(() => { this.isSubmitted = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.isSubmitted = false; }, 500);
                }
            });
    }
}
