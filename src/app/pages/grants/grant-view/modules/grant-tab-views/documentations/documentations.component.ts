import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { Project } from 'src/app/interfaces/_project.interface';
import { DocumentService } from 'src/app/services/document.service';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { PhotosComponent } from './modules/photos/photos.component';
import { VideosComponent } from './modules/videos/videos.component';
import { DocumentsComponent } from './modules/documents/documents.component';
import { LinksComponent } from './modules/links/links.component';
@Component({
    selector: 'app-documentations',
    templateUrl: './documentations.component.html',
    styleUrls: ['./documentations.component.scss']
})
export class DocumentationsComponent implements OnInit {
    @ViewChild(PhotosComponent) photos: PhotosComponent;
    @ViewChild(VideosComponent) videos: VideosComponent;
    @ViewChild(DocumentsComponent) documents: DocumentsComponent;
    @ViewChild(LinksComponent) links: LinksComponent;

    project: Project | null = null;
    grantSignalService = inject(GrantSignalService);

    constructor(
        public documentUploaderRef: BsModalRef,
        private cdr: ChangeDetectorRef,
        private documentService: DocumentService,
        private modalService: BsModalService,
    ) {

    }

    ngOnInit(): void {
        this.project = this.grantSignalService.project();
    }

    uploadFiles() {
        const initialState: ModalOptions = {
            class: 'modal-lg',
        };
        this.documentUploaderRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentUploaderRef.content.document.subscribe((res: any) => {
            this.save(res.file);
            this.cdr.detectChanges();
        });
    }

    save(file: any) {
        this.documentService
            .save({
                table_pk: this.project?.pk,
                table_name: 'projects',
                document_pk: file.pk,
                type: 'documentation',
            })
            .subscribe({
                next: (data: any) => {
                    const file = data.data;

                    if (file.mime_type.includes('image')) {
                        this.photos.append(file);
                    }
                    else if (file.mime_type.includes('video')) {
                        this.videos.append(file);
                    }
                    else if (file.mime_type.includes('application')) {
                        this.documents.append(file);
                    }
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }
}
