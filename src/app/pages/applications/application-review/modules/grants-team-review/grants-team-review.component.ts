import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationRead } from 'src/app/interfaces/application.interface';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';

@Component({
    selector: 'app-grants-team-review',
    templateUrl: './grants-team-review.component.html',
    styleUrls: ['./grants-team-review.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GrantsTeamReviewComponent implements OnInit {
    @Input() currentApplication: ApplicationRead | null
    reviews: any = {
        grants_team_review: [],
        advisers_review: [],
        final_review: []
    };
    dateNow = DateTime.now().toFormat('LLLL dd, yyyy');
    user: any = {};

    submitted: boolean = false;
    form: FormGroup;

    attachments: any = [];

    constructor(
        public documentUploaderRef: BsModalRef,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.setForm();
        this.fetchUser();

        if (this.currentApplication?.reviews) {
            this.currentApplication?.reviews.forEach(review => {
                this.reviews[review.type].push(review);
            });
        }
    }

    get f() { return this.form.controls; }

    setForm() {
        this.form = this.formBuilder.group({
            pk: [''],
            message: ['', Validators.required],
            flag: [''],
            application_pk: [''],
            type: ['grants_team_review'],
            documents: ['']
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
            this.form.get('application_pk')?.patchValue(this.currentApplication?.pk);
            this.applicationService
                .saveReview(this.form.value)
                .subscribe({
                    next: (data: any) => {
                        this.reviews.grants_team_review.push(data.data);
                        this.clear();
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

    clear() {
        this.attachments = [];
        this.form.reset();
    }

    uploadFiles() {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.attachments.push(res.file);
            this.form.get('documents')?.patchValue(this.attachments);
            this.cdr.detectChanges();
        });
    }
}
