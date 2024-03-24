import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';

@Component({
    selector: 'app-attach-documents',
    templateUrl: './attach-documents.component.html',
    styleUrls: ['./attach-documents.component.scss']
})
export class AttachDocumentsComponent {
    @Output() onFileAttached: EventEmitter<any> = new EventEmitter();
    attachments: any = [];

    constructor(
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService,
    ) { }

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
}
