import { Component, OnInit } from '@angular/core';
import * as _ from '../../../../../../../../utilities/globals';
import { DocumentService } from 'src/app/services/document.service';
import { DocumentationModalComponent } from '../../documentation-modal/documentation-modal.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-videos',
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.scss']
})
export class VideosComponent {
    bsModalRef?: BsModalRef;

    show: boolean = false;
    documents: any = [];
    url: String = _.BASE_URL;

    selected: any = [];
    filters: any = {};

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;

    constructor(
        private documentService: DocumentService,
        private modalService: BsModalService,
    ) {

    }

    ngOnInit(): void {
        this.filters = {
            keyword: '',
            mimetype: 'video',
            archived: false,
            skip: 0,
            take: this.pagination.tableSize
        };

        this.fetch();
    }

    fetch() {
        this.filters.skip = (this.pagination.page * this.pagination.tableSize) - this.pagination.tableSize;
        this.filters.take = this.pagination.tableSize;

        this.documentService
            .fetch(this.filters)
            .subscribe({
                next: (data: any) => {
                    this.documents = data.data;

                    this.pagination.count = data.total;
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
        this.pagination.page = event;
        this.fetch();
    }

    onTableSizeChange(event: any): void {
        this.pagination.tableSize = event.target.value;
        this.pagination.page = 1;
        this.fetch();
    }

    onImgError(event: any) {
        event.target.src = this.url + '/assets/images/not-found.png';
    }
}
