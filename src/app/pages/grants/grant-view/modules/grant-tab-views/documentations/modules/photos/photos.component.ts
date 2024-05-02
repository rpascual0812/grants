import { Component, OnInit, inject } from '@angular/core';
import * as _ from '../../../../../../../../utilities/globals';
import { DocumentationModalComponent } from '../../documentation-modal/documentation-modal.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { Project } from 'src/app/interfaces/_project.interface';
import { ProjectService } from 'src/app/services/project.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
    selector: 'app-photos',
    templateUrl: './photos.component.html',
    styleUrls: ['./photos.component.scss']
})
export class PhotosComponent {
    bsModalRef?: BsModalRef;

    show: boolean = false;
    documents: any = [];
    url: String = _.BASE_URL;

    selected: any = [];
    filters: any = {};

    paginationPhotos: any = _.PAGINATION;
    tableSizesPhotos: any = _.TABLE_SIZES;

    project: Project | null = null;
    grantSignalService = inject(GrantSignalService);

    constructor(
        private projectService: ProjectService,
        private documentService: DocumentService,
        private modalService: BsModalService,
    ) {

    }

    ngOnInit(): void {
        this.project = this.grantSignalService.project();

        this.filters = {
            keyword: '',
            project_pk: this.project?.pk,
            mimetype: 'image',
            archived: false,
            skip: 0,
            take: this.paginationPhotos.tableSize
        };

        this.fetch();
    }

    append(file: any) {
        // this.documents.unshift(file);
        this.fetch();
    }

    fetch() {
        this.filters.skip = (this.paginationPhotos.page * this.paginationPhotos.tableSize) - this.paginationPhotos.tableSize;
        this.filters.take = this.paginationPhotos.tableSize;

        this.projectService
            .fetchProjectDocuments(this.filters)
            .subscribe({
                next: (data: any) => {
                    this.documents = data.data;

                    this.paginationPhotos.count = data.total;
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }

    toggleDocument(i: any) {
        this.documents[i].selected = !this.documents[i].selected;
        (this.documents[i].selected) ?
            this.selected.push(this.documents[i])
            :
            this.selected = this.selected.filter((selected: any) => selected.pk != this.documents[i].pk);
    }

    view(i: number) {
        const event = this.documents[i];
        const title = this.documents[i].original_name;

        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                title: title,
                document: this.documents[i]
            }
        };
        this.bsModalRef = this.modalService.show(DocumentationModalComponent, initialState);
        this.bsModalRef.content.closeBtnName = 'Close';
    }

    delete(i: number) {
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
                    .destroy(this.documents[i].pk)
                    .subscribe({
                        next: (data: any) => {
                            this.documents.splice(i, 1);
                        },
                        error: (error: any) => {
                            console.log(error);
                        },
                        complete: () => {
                            console.log('Complete');
                        }
                    });
            }
        );

    }

    onTableDataChange(event: any) {
        this.paginationPhotos.page = event;
        this.fetch();
    }

    onTableSizeChange(event: any): void {
        this.paginationPhotos.tableSize = event.target.value;
        this.paginationPhotos.page = 1;
        this.fetch();
    }

    onImgError(event: any) {
        event.target.src = this.url + '/assets/images/not-found.png';
    }
}
