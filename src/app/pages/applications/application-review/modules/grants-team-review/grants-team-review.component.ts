import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from 'src/app/services/application.service';
@Component({
    selector: 'app-grants-team-review',
    templateUrl: './grants-team-review.component.html',
    styleUrls: ['./grants-team-review.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GrantsTeamReviewComponent implements OnInit {
    reviews: any = [];
    dateNow = DateTime.now().toFormat('LLLL dd, yyyy');
    user: any = {};

    submitted: boolean = false;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
    ) { }

    ngOnInit() {
        this.setForm();
        this.fetchUser();
    }

    get f() { return this.form.controls; }

    setForm() {
        this.form = this.formBuilder.group({
            pk: [''],
            message: ['', Validators.required],
            flag: [''],
            application_pk: ['']
        });
    }

    fetchUser() {
        this.userService.fetch()
            .subscribe({
                next: (data: any) => {
                    this.user = data;
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }

    submit() {
        this.submitted = true;
        if (!this.form.invalid) {
            this.form.get('application_pk')?.patchValue(1);
            this.applicationService
                .saveReview(this.form.value)
                .subscribe({
                    next: (data: any) => {
                        console.log(data);
                        this.toastr.success('Your review has been successfully saved', 'SUCCESS!');
                    },
                    error: (error: any) => {
                        this.submitted = false;
                        console.log(error);
                        this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                    },
                    complete: () => {
                        this.submitted = false;
                        console.log('Complete');
                    }
                });
        }
    }

}
