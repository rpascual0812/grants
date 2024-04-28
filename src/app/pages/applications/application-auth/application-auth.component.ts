import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-application-auth',
    templateUrl: './application-auth.component.html',
    styleUrls: ['./application-auth.component.scss'],
})
export class ApplicationAuthComponent implements OnInit {
    form: FormGroup;
    isSubmitted: boolean = false;
    year: any;
    user: any;

    constructor(private router: Router, private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            remember: [false],
        });

        this.year = DateTime.now().year;
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.form.controls;
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            this.isSubmitted = false;
            return;
        }
        this.router.navigateByUrl('/public/application/status');
    }

    submit() {
        this.router.navigateByUrl('forgot-password');
    }
}
