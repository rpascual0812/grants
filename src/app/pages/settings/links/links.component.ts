import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { LinkGeneratorComponent } from 'src/app/components/link-generator/link-generator.component';
import { ApplicationService } from 'src/app/services/application.service';

import * as _ from '../../../utilities/globals';
import { NewLinkModalComponent } from './new-link-modal/new-link-modal.component';

@Component({
    selector: 'app-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.scss']
})
export class LinksComponent {
    bsModalRef?: BsModalRef;
    @ViewChild(LinkGeneratorComponent) linkGeneratorComponent: LinkGeneratorComponent;

    applications: any = [];
    link: string = window.location.origin + '/public/application/';
    filters: any = {};

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;

    constructor(
        private applicationService: ApplicationService,
        private modalService: BsModalService,
    ) {

    }

    ngOnInit(): void {
        this.fetch();
    }

    fetch() {
        this.applicationService.fetch(this.filters).subscribe({
            next: (res: any) => {
                const data = res?.data ?? [];
                this.applications = data;
                this.pagination.count = res.total;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    generate() {
        this.linkGeneratorComponent.submit();
    }

    refresh() {
        this.linkGeneratorComponent.reset();
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

    openModal() {
        const initialState: ModalOptions = {
            class: 'modal-xl',
            initialState: {
                title: 'New Application',
            }
        };
        this.bsModalRef = this.modalService.show(NewLinkModalComponent, initialState);
        this.bsModalRef.content.saveBtnName = 'Send';
        this.bsModalRef.content.closeBtnName = 'Cancel';
        this.bsModalRef.content.activateBtnName = 'Activate';

        this.bsModalRef.content.callback.subscribe((res: any) => {
            const data = res.data.data;
            this.fetch();
        });
    }
}
