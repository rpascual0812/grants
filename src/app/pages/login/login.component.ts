import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    isSubmitted: boolean = false;
    year: any;
    user: any;

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

        this.year = DateTime.now().year;
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            console.log('form is invalid');
            this.isSubmitted = false;
            return;
        }

        this.authService.login(this.form.value)
            .subscribe({
                next: (data: any) => {
                    this.user = data.user;
                    const exp = (JSON.parse(atob(data.user.access_token.split('.')[1]))).exp;

                    if (this.user.active) {
                        this.authService.setSession(data);
                        this.router.navigateByUrl('/');
                    }
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

    submit() {
        this.router.navigateByUrl('forgot-password');
    }
}
