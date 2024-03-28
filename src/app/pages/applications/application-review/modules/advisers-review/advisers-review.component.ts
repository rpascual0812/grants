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
    selector: 'app-advisers-review',
    templateUrl: './advisers-review.component.html',
    styleUrls: ['./advisers-review.component.scss']
})
export class AdvisersReviewComponent implements OnInit {
    @Input() currentApplication: ApplicationRead | null
    reviews: any = {
        advisers_review: [],
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
                if (this.reviews[review.type]) {
                    this.reviews[review.type].push(review);
                }
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
            type: ['advisers_review'],
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
                        data.data.user = this.user;
                        this.reviews.advisers_review.push(data.data);
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
        this.form.get('type')?.patchValue('advisers_review');
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
