import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationRead } from 'src/app/interfaces/application.interface';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import * as _ from '../../../../../utilities/globals';
import { HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-grants-team-review',
    templateUrl: './grants-team-review.component.html',
    styleUrls: ['./grants-team-review.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GrantsTeamReviewComponent implements OnInit {
    @Input() currentApplication: ApplicationRead | null
    reviews: any = {
        grants_team_review: []
    };

    dateNow = DateTime.now().toFormat('LLLL dd, yyyy');
    user: any = {};

    submitted: boolean = false;
    form: FormGroup;

    attachments: any = [];
    recommendation: any = '';

    content: any;
    SERVER: string = '';

    constructor(
        public documentUploaderRef: BsModalRef,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private applicationService: ApplicationService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.setForm();
        this.fetchUser();

        this.SERVER = _.BASE_URL;

        if (this.currentApplication?.reviews) {
            this.currentApplication?.reviews.forEach(review => {
                if (this.reviews[review.type]) {
                    this.reviews[review.type].push(review);
                }
            });
        }

        if (this.currentApplication?.recommendations) {
            this.currentApplication?.recommendations.forEach(recommendation => {
                if (recommendation.type == 'grants_team_review') {
                    this.recommendation = recommendation.recommendation;
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
                        data.data.user = this.user;
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
        this.form.get('type')?.patchValue('grants_team_review');
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

    delete(i: number) {
        const review = this.reviews.grants_team_review[i];
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this application?</strong>',
                icon: 'question',
                buttons: {
                    showClose: true,
                    showCancel: true,
                    focusConfirm: false,
                },
                confirmButtonText: '<i class="fa fa-trash"></i> Delete',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel',
            },
            () => {
                this.applicationService.destroyReview(review.pk).subscribe({
                    next: (data: any) => {
                        this.reviews.grants_team_review.splice(i, 1);
                    },
                    error: (err: HttpErrorResponse) => {
                        const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                        const statusCode = err?.status ? `status: ${err?.status}` : '';
                        this.toastr.error(`Error trying to remove application. ${statusCode} ${errorMessage} `);
                    },
                });
            }
        );
    }

    recommendationOnChange(ev: any) {
        const recommendation = {
            application_pk: this.currentApplication?.pk,
            recommendation: ev,
            type: 'grants_team_review'
        }

        this.applicationService.updateRecommendation(recommendation).subscribe({
            next: (data: any) => {
                this.toastr.success(`Your recommendation has been successfully saved.`);
            },
            error: (err: HttpErrorResponse) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(`Error trying to remove application. ${statusCode} ${errorMessage} `);
            },
        });
    }

    export() {
        this.applicationService.reviews(this.currentApplication?.pk, 'grants_team_review').subscribe({
            next: (data: any) => {
                let reviews = '';
                data.data[0].reviews.forEach((review: any) => {
                    const date = formatDate(review.date_created, 'yyyy-MM-dd HH:mm:ss', "en-US");
                    reviews += review.message + ' - ' + review.user.first_name + ' ' + review.user.last_name + ' - ' + date + '\n\n'
                    review.documents.forEach((doc: any) => {
                        reviews += this.SERVER + '/' + doc.path + '\n';
                    });
                    reviews += '\n\n\n';
                });
                _.exportFile('application/docx', 'Grants Team Review.docx', reviews);
            },
            error: (err: HttpErrorResponse) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(`Error trying to remove application. ${statusCode} ${errorMessage} `);
            },
        });


    }
}
