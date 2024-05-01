import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { DocumentService } from 'src/app/services/document.service';
@Component({
    selector: 'app-documentations',
    templateUrl: './documentations.component.html',
    styleUrls: ['./documentations.component.scss']
})
export class DocumentationsComponent implements OnInit {
    constructor(
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private documentService: DocumentService,
        private modalService: BsModalService,
    ) {

    }

    ngOnInit(): void {

    }

    uploadFiles() {
        const initialState: ModalOptions = {
            class: 'modal-lg',
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            console.log(res.file);
            this.cdr.detectChanges();
        });
    }
}
