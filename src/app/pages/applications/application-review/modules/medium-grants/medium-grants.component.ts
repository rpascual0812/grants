import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, effect, inject } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { ApplicationRead } from 'src/app/interfaces/application.interface';
import { ApplicationService } from 'src/app/services/application.service';
import * as _ from '../../../../../utilities/globals';

@Component({
    selector: 'app-medium-grants',
    templateUrl: './medium-grants.component.html',
    styleUrls: ['./medium-grants.component.scss']
})
export class MediumGrantsComponent implements OnInit {
    @Input() currentApplication: ApplicationRead | null

    attachments: any = {
        additional_information: [],
        management_capacity: []
    };

    SERVER: string = _.BASE_URL;

    constructor(
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private applicationService: ApplicationService,
    ) { }

    ngOnInit() {
        this.currentApplication?.documents?.forEach(doc => {
            if (this.attachments[doc.type]) {
                this.attachments[doc.type].push(doc);
            }
        });
    }

    uploadFiles(type: string) {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.linkAttachment(res.file, type);
            this.cdr.detectChanges();
        });
    }

    linkAttachment(file: any, type: string) {
        this.applicationService
            .saveMediumGrantsAttachment({ application_pk: this.currentApplication?.pk, file: file, type: type })
            .subscribe({
                next: (data: any) => {
                    this.attachments[type].push(file);
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

    deleteAttachment(i: number, type: string) {
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
                    .deleteApplicationAttachment({ application_pk: this.currentApplication?.pk, document_pk: this.attachments[type][i].pk })
                    .subscribe({
                        next: (data: any) => {
                            if (data.status) {
                                this.attachments[type].splice(i, 1);
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
