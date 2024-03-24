import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';

@Component({
    selector: 'app-medium-grants',
    templateUrl: './medium-grants.component.html',
    styleUrls: ['./medium-grants.component.scss']
})
export class MediumGrantsComponent {
    attachments: any = {
        additional_information: [],
        management_capacity: []
    };

    constructor(
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService,
    ) { }

    uploadFiles(type: string) {
        const initialState: ModalOptions = {
            class: 'modal-lg'
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.attachments[type].push(res.file);
            this.cdr.detectChanges();
        });
    }
}
