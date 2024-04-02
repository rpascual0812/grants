import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import * as _ from '../../../../../utilities/globals';
import { DocumentService } from 'src/app/services/document.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-attach-documents',
    templateUrl: './attach-documents.component.html',
    styleUrls: ['./attach-documents.component.scss']
})
export class AttachDocumentsComponent implements OnInit {
    @Output() onFileAttached: EventEmitter<any> = new EventEmitter();
    @Input() inputAttachments: any = [];
    attachments: any = [];
    SERVER: string = _.BASE_URL;

    constructor(
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService,
        private documentService: DocumentService,
        private toastr: ToastrService,
    ) { }

    ngOnInit() {
        this.attachments = this.inputAttachments;
    }

    uploadFiles() {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.attachments.push(res.file);
            this.onFileAttached.emit(res.file);
            this.cdr.detectChanges();
        });
    }

    delete(index: number) {
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
                this.documentService
                    .destroy(this.attachments[index].pk)
                    .subscribe({
                        next: (data: any) => {
                            if (data.status) {
                                this.attachments[index].splice(index, 1);
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
