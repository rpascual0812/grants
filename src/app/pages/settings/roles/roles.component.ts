import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from '../../../utilities/globals';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/roles.service';
import { RolesModalComponent } from './roles-modal/roles-modal.component';
import { LogsComponent } from 'src/app/components/logs/logs.component';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
    bsModalRef?: BsModalRef;

    loading: boolean = false;
    roles: any = [];
    filters: any = {};
    url: String = _.BASE_URL;

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private roleService: RoleService
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

    fetch() {
        this.roleService
            .fetchAll(this.filters)
            .subscribe({
                next: (data: any) => {
                    this.roles = data.data;
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }

    openModal(role: any) {
        const title = role && role.pk ? 'Edit' : 'Add role';

        const initialState: ModalOptions = {
            class: 'modal-md',
            initialState: {
                title: title,
                role: role
            }
        };
        this.bsModalRef = this.modalService.show(RolesModalComponent, initialState);
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

    showLogs(role: any) {
        const title = role && role.pk ? 'Edit ' + role.first_name : 'Add role';
        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                title: title,
                role: role
            }
        };
        this.bsModalRef = this.modalService.show(LogsComponent, initialState);
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
}
