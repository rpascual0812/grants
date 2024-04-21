import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as _ from '../../../../../../../utilities/globals';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { UserService } from 'src/app/services/user.service';
import { DateTime } from 'luxon';
import { Project } from 'src/app/interfaces/_project.interface';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-completed',
    templateUrl: './completed.component.html',
    styleUrls: ['./completed.component.scss']
})
export class CompletedComponent {
    @Input() project: Project | null = null;
    @Output() recommendationSaved = new EventEmitter<boolean>();

    user: any = {};
    reviews: any = [];
    SERVER: string = _.BASE_URL;
    submitted: boolean = false;
    attachments: any = [];
    form: FormGroup;
    dateNow = DateTime.now().toFormat('LLLL dd, yyyy');
    recommendation: any = '';

    constructor(
        private projectService: ProjectService,
        private toastr: ToastrService,
        public documentUploaderRef: BsModalRef,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private userService: UserService,
    ) {

    }

    ngOnInit() {
        this.setForm();
        this.fetchUser();
        this.reviews = this.project?.reviews.filter((review: any) => review.type == 'completed');

        if (this.project?.recommendations) {
            this.project?.recommendations.forEach(recommendation => {
                if (recommendation.type == 'completed') {
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
            project_pk: [''],
            type: ['completed'],
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

    delete(i: number) {
        const review = this.reviews[i];
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this review?</strong>',
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
                this.projectService.destroyReview(review.pk).subscribe({
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
                this.projectService
                    .deleteReviewAttachment({ application_pk: this.project?.pk, review_pk: this.reviews[review_index].pk, document_pk: this.reviews[review_index].documents[document_index].pk })
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

    submit() {
        this.submitted = true;
        if (!this.form.invalid) {
            this.form.get('project_pk')?.patchValue(this.project?.pk);
            this.projectService
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
    }

    recommendationOnChange(ev: any) {
        const recommendation = {
            project_pk: this.project?.pk,
            recommendation: ev,
            type: 'completed'
        }

        this.projectService.updateRecommendation(recommendation).subscribe({
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
        this.projectService.reviews(this.project?.pk, 'completed').subscribe({
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
                _.exportFile('application/docx', 'Contract Preparation.docx', reviews);
            },
            error: (err: HttpErrorResponse) => {
                const errorMessage = err?.error?.message ? `message: ${err?.error?.message}` : '';
                const statusCode = err?.status ? `status: ${err?.status}` : '';
                this.toastr.error(`Error trying to remove application. ${statusCode} ${errorMessage} `);
            },
        });
    }
}
