import { Component, OnInit, inject } from '@angular/core';
import * as _ from '../../../../../../../../utilities/globals';
import { DocumentService } from 'src/app/services/document.service';
import { DocumentationModalComponent } from '../../documentation-modal/documentation-modal.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {
    bsModalRef?: BsModalRef;

    show: boolean = false;
    documents: any = [];
    url: String = _.BASE_URL;

    selected: any = [];
    filters: any = {};

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;

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
            mimetype: 'application',
            archived: false,
            skip: 0,
            take: this.pagination.tableSize
        };

        this.fetch();
    }

    append(file: any) {
        // this.documents.unshift(file);
        this.fetch();
    }

    fetch() {
        this.filters.skip = (this.pagination.page * this.pagination.tableSize) - this.pagination.tableSize;
        this.filters.take = this.pagination.tableSize;

        this.projectService
            .fetchProjectDocuments(this.filters)
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

    download(i: number) {
        _.download(this.documents[i]);
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

    getIcon(document: any) {
        let result = 'file';
        if (document.mime_type.includes('pdf')) {
            result = 'pdf';
        }
        else if (document.mime_type.includes('sheet')) {
            result = 'xls';
        }
        else if (document.mime_type.includes('document')) {
            result = 'doc';
        }
        else if (document.mime_type.includes('zip')) {
            result = 'zip';
        }

        result = '/assets/images/' + result + '.png'
        return result;
    }
}
