import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationRead } from 'src/app/interfaces/application.interface';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from '../../../../../utilities/globals';

type GrantTypeItem = {
    pk?: number;
    name: string;
    description?: string
};
@Component({
    selector: 'app-due-diligence-final-review',
    templateUrl: './due-diligence-final-review.component.html',
    styleUrls: ['./due-diligence-final-review.component.scss']
})
export class DueDiligenceFinalReviewComponent {
    @Input() currentApplication: ApplicationRead | null
    reviews: any = {
        final_review: [],
    };
    dateNow = DateTime.now().toFormat('LLLL dd, yyyy');
    user: any = {};

    submitted: boolean = false;
    form: FormGroup;

    attachments: any = [];
    recommendation: any = '';

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
            type: ['final_review'],
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
            console.log(this.form.value);
            this.applicationService
                .saveReview(this.form.value)
                .subscribe({
                    next: (data: any) => {
                        data.data.user = this.user;
                        this.reviews.final_review.push(data.data);
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
        this.form.get('type')?.patchValue('final_review');
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

    onChangeGrantType(item: GrantTypeItem[] | string[], key: string) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as GrantTypeItem)?.['pk' ?? ''] ?? '';
        const data = {
            application_pk: this.currentApplication?.pk,
            project: {
                type_pk: pk
            }
        }

        this.applicationService.store(data).subscribe({
            next: (res: any) => {
                this.toastr.success('The Grant Type has been successfully saved', 'SUCCESS!');
            },
            error: (err: any) => {
                console.log(err);
            },
        });

    }

    delete(i: number) {
        const review = this.reviews.final_review[i];
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
                        this.reviews.final_review.splice(i, 1);
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
        console.log(ev);
        const recommendation = {
            application_pk: this.currentApplication?.pk,
            recommendation: ev,
            type: 'final_review'
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
}
