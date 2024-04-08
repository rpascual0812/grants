import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from '../../utilities/globals';
import { LogsComponent } from 'src/app/components/logs/logs.component';

import { Subscription } from 'rxjs';
import { DonorService } from 'src/app/services/donor.service';
import { DonorModalComponent } from './donor-modal/donor-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-donor',
    templateUrl: './donor.component.html',
    styleUrls: ['./donor.component.scss']
})
export class DonorComponent implements OnInit {

    bsModalRef?: BsModalRef;

    loading: boolean = false;
    roles: any = [];
    donors: any = [];
    filters: any = {};
    url: String = _.BASE_URL;

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;
    timeout: any = null;

    @ViewChild('modal', { read: ViewContainerRef })
    entry!: ViewContainerRef;
    sub!: Subscription;

    constructor(
        private donorService: DonorService,
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private toastr: ToastrService,
    ) {

    }

    ngOnInit(): void {
        this.filters = {
            keyword: '',
            archived: false,
            skip: 0,
            take: this.pagination.tableSize
        };

        this.fetch();
    }

    search() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.fetch();
        }, 1000);
    }

    fetch() {
        this.filters.skip = (this.pagination.page * this.pagination.tableSize) - this.pagination.tableSize;
        this.filters.take = this.pagination.tableSize;

        this.donorService
            .fetchAll(this.filters)
            .subscribe({
                next: (data: any) => {
                    this.donors = data.data;
                    this.pagination.count = data.total;
                },
                error: (error: any) => {
                    console.log(error);
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                }
            });
    }

    openModal(donor: any) {
        const title = donor ? 'Edit ' + donor.name : 'Add donor';
        donor = donor ? donor : {
            name: '',
            code: '',
            active: true,
            archived: false
        }

        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                title: title,
                donor: donor
            }
        };
        this.bsModalRef = this.modalService.show(DonorModalComponent, initialState);
        this.bsModalRef.content.saveBtnName = 'Save';
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.activateBtnName = 'Activate';

        this.bsModalRef.content.callback.subscribe((res: any) => {
            try {
                this.fetch();
            } catch (error: any) {
                _.errorMessage("This is a test error alert");
            }
        });
    }

    suspend(donor: any) {
        _.confirmMessage({
            title: '<strong>Are you sure you want to ' + (donor.account.active ? 'lock' : 'unlock') + ' this account? ' + donor.first_name + (donor.account.active ? ' will no longer be able to log in' : ' will now be able to login') + '.</strong>',
            icon: 'question',
            buttons: {
                showClose: true,
                showCancel: true,
                focusConfirm: false
            },
            confirmButtonText: '<i class="fa fa-' + (donor.account.active ? 'lock' : 'unlock') + '"></i> ' + (donor.account.active ? 'Lock' : 'Unlock'),
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel'
        }, () => {
            donor.active = !donor.active;
            this.donorService
                .save({ ...donor })
                .subscribe({
                    next: (data: any) => {
                        donor.account.active = !donor.account.active;
                    },
                    error: (error: any) => {
                        console.log(error);
                    },
                    complete: () => {

                    }
                });
        });
    }

    deactivate(donor: any) {
        _.confirmMessage({
            title: '<strong>Are you sure you want to ' + (donor.archived ? 'restore' : 'delete') + ' this donor?</strong>',
            icon: 'question',
            buttons: {
                showClose: true,
                showCancel: true,
                focusConfirm: false
            },
            confirmButtonText: '<i class="fa fa-' + (donor.archived ? 'undo' : 'trash') + '"></i> ' + (donor.archived ? 'Restore' : 'Delete'),
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel'
        }, () => {
            donor.archived = !donor.archived;
            this.donorService
                .save({ ...donor })
                .subscribe({
                    next: (data: any) => {
                        this.toastr.success('The donor has been successfully ' + (donor.archived ? 'deleted' : 'restored'), 'SUCCESS!');
                    },
                    error: (error: any) => {
                        console.log(error);
                    },
                    complete: () => {

                    }
                });
        });
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
}
