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

    selections: any = [
        'restricted', 'read-only', 'comments', 'recommendation'
    ];

    restrictions: any = {
        grant_application: '',
        contract_finalization: '',
        fund_release: ''
    }

    page: number = 1;

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
                    this.roles.forEach((role: any) => {
                        role.restrictions = role.restrictions ? role.restrictions : this.restrictions;
                    });
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

        this.bsModalRef.content.callback.subscribe((res: any) => {
            try {
                this.fetch();
            } catch (error: any) {
                _.errorMessage("This is a test error alert");
            }
        });
    }

    showLogs(role: any) {
        const title = role.name + ' logs';
        role.entity = 'roles';
        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                title: title,
                module: role
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

    showRoles(role: any) {
        this.roles.forEach((_role: any) => role.pk != _role.pk ? _role.show = false : '');
        role.show = !role.show;
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

    handleIsOpenChange($event: boolean, id: string) {
        const currentIdx = this.roles.findIndex((role: any) => role['id'] === id);
        this.roles[currentIdx]['expanded'] = $event;
    }

    onSelect(ev: any, i: number, type: string) {
        this.restrictions[type] = ev[0];
        this.roles[i].restrictions = this.restrictions;
        this.saveRestriction(this.roles[i]);
    }

    onDeselect(ev: any, i: number, type: string) {
        this.restrictions[type] = '';
        this.roles[i].restrictions = this.restrictions;
        this.saveRestriction(this.roles[i]);
    }

    saveRestriction(role: any) {
        this.roleService
            .saveRestriction(role)
            .subscribe({
                next: (data: any) => {
                    console.log(data);
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
