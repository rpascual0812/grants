import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from 'src/app/interfaces/_application.interface';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
import * as _ from '../../../../../utilities/globals';

@Component({
    selector: 'app-financial-management-capacity',
    templateUrl: './financial-management-capacity.component.html',
    styleUrls: ['./financial-management-capacity.component.scss']
})
export class FinancialManagementCapacityComponent implements OnInit {
    @Input() currentApplication: Application | null
    @Output() recommendationSaved = new EventEmitter<boolean>();
    reviews: any = [];
    dateNow = DateTime.now().toFormat('LLLL dd, yyyy');
    user: any = {};

    submitted: boolean = false;
    form: FormGroup;

    attachments: any = [];
    recommendation: any = '';
    SERVER: string = _.BASE_URL;

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
            this.reviews = this.currentApplication?.reviews.filter((review: any) => review.type == 'financial_management_capacity');
        }

        if (this.currentApplication?.recommendations) {
            this.currentApplication?.recommendations.forEach(recommendation => {
                if (recommendation.type == 'financial_management_capacity') {
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
            needs_resolution: [false],
            grantee: [false],
            application_pk: [''],
            type: ['financial_management_capacity'],
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
                        this.reviews.push(data.data);
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
        this.form.get('type')?.patchValue('financial_management_capacity');
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
        const review = this.reviews[i];
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
                        this.reviews.splice(i, 1);
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
            type: 'financial_management_capacity'
        }

        this.applicationService.updateRecommendation(recommendation).subscribe({
            next: (data: any) => {
                this.toastr.success(`Your recommendation has been successfully saved.`);
                this.recommendationSaved.emit(true);
            },
            error: (err: HttpErrorResponse) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(`Error trying to remove application. ${statusCode} ${errorMessage} `);
            },
        });
    }

    export() {
        this.applicationService.reviews(this.currentApplication?.pk, 'financial_management_capacity').subscribe({
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
                _.exportFile('application/docx', 'Financial Management Capacity.docx', reviews);
            },
            error: (err: HttpErrorResponse) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(`Error trying to remove application. ${statusCode} ${errorMessage} `);
            },
        });
    }

    resolve(i: number) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to resolve this review?</strong>',
                icon: 'question',
                buttons: {
                    showClose: true,
                    showCancel: true,
                    focusConfirm: false,
                },
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel',
            },
            () => {
                const data = {
                    application_pk: this.currentApplication?.pk,
                    review_pk: this.reviews[i].pk
                }
                this.applicationService.resolveReview(data).subscribe({
                    next: (data: any) => {
                        this.reviews[i].resolved = true;
                        this.toastr.success(`The review has been resolved sucessfully`);
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

    deleteAttachment(review_index: number, document_index: number, type: string) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this attachment?</strong>',
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
                this.applicationService
                    .deleteReviewAttachment({ application_pk: this.currentApplication?.pk, review_pk: this.reviews[review_index].pk, document_pk: this.reviews[review_index].documents[document_index].pk })
                    .subscribe({
                        next: (data: any) => {
                            if (data.status) {
                                this.reviews[review_index].documents.splice(document_index, 1);
                            }
                        },
                        error: (error: any) => {
                            console.log(error);
                            this.toastr.error('An error occurred while updating the user. Please try again', 'ERROR!');
                        },
                        complete: () => {
                            console.log('Complete');
                        }
                    });
            }
        );
    }
}