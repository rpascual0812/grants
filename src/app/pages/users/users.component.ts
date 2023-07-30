import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from '../../utilities/globals';
import { UsersModalComponent } from './users-modal/users-modal.component';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/roles.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    bsModalRef?: BsModalRef;

    loading: boolean = false;
    roles: any = [];
    users: any = [];
    filters: any = {};
    url: String = _.BASE_URL;

    pagination: any = {
        page: 1,
        count: 0,
        tableSize: 10
    };
    tableSizes = _.TABLE_SIZES;

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

        this.fetchRoles();
        this.fetch();
    }

    fetchRoles() {
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

    fetch() {
        this.filters.skip = (this.pagination.page * this.pagination.tableSize) - this.pagination.tableSize;
        this.filters.take = this.pagination.tableSize;

        this.userService
            .fetchAll(this.filters)
            .subscribe({
                next: (data: any) => {
                    this.users = data.data;
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

    userModal(user: any) {
        const title = user ? 'Edit ' + user.first_name : 'Add user';

        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                title: title,
                user: user,
            }
        };
        this.bsModalRef = this.modalService.show(UsersModalComponent, initialState);
        this.bsModalRef.content.saveBtnName = 'Save';
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.activateBtnName = 'Activate';

        this.bsModalRef.content.callback.subscribe((res: any) => {
            try {
                const data = res.data.data;
                _.successMessage("This is a test success alert");

                this.users.filter((user: any) => user.pk == data.pk)
                    .forEach((user: any) => {
                        user.first_name = data.first_name;
                        user.last_name = data.last_name;
                    });
            } catch (error: any) {
                _.errorMessage("This is a test error alert");
            }
        });
    }

    checkRoles(user_role: any, role: any) {
        // check if the role can be found inside the user_role
        return user_role.filter((user_role: any) => user_role.role_pk == role.pk).length > 0 ? true : false;
    }

    updateRole(role: any, user: any, evt: any) {
        role.checked = evt.target.checked;
        this.roleService
            .save(role, user)
            .subscribe({
                next: (data: any) => {
                    if (evt.target.checked) {
                        console.log(data.raw[0]);
                    }
                    else {

                    }
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });


        evt.stopPropagation();
    }

    getActiveRoles(user_role: any) {
        let count = 0;
        user_role.forEach((_user_role: any) => {
            this.roles.forEach((role: any) => {
                if (_user_role.role_pk == role.pk) {
                    count++;
                }
            });
        })
        return count;
    }
}
