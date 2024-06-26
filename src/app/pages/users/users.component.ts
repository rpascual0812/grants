import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from '../../utilities/globals';
import { UsersModalComponent } from './users-modal/users-modal.component';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/roles.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ResetPasswordModalComponent } from './reset-password-modal/reset-password-modal.component';
import { LogsComponent } from 'src/app/components/logs/logs.component';

import { Subscription } from 'rxjs';
import { ModalService } from '../../components/modal/modal.service';
import { LinkGeneratorComponent } from 'src/app/components/link-generator/link-generator.component';
import { ApplicationService } from 'src/app/services/application.service';

import { ToastrService } from 'ngx-toastr';

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

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;

    @ViewChild('modal', { read: ViewContainerRef })
    entry!: ViewContainerRef;
    sub!: Subscription;

    timeout: any = null;

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private roleService: RoleService,
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

    search() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.fetch();
        }, 1000);
    }

    fetch() {
        this.filters.skip = (this.pagination.page * this.pagination.tableSize) - this.pagination.tableSize;
        this.filters.take = this.pagination.tableSize;
        this.filters.orderBy = 'Sort by Name';

        this.userService
            .fetchAll(this.filters)
            .subscribe({
                next: (data: any) => {
                    this.users = data.data;

                    this.users.forEach((user: any) => {
                        user['roles'] = user.user_role.map((role: any) => ({
                            pk: role.role_pk
                        }));
                    })

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
                roles: this.roles
            }
        };
        this.bsModalRef = this.modalService.show(UsersModalComponent, initialState);
        this.bsModalRef.content.saveBtnName = 'Save';
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.activateBtnName = 'Activate';

        this.bsModalRef.content.callback.subscribe((res: any) => {
            try {
                // const data = res.data.data;
                // console.log('updated user', data);
                this.fetch();
                // this.users.filter((user: any) => user.pk == data.pk)
                //     .forEach((user: any) => {
                //         user.first_name = data.first_name;
                //         user.last_name = data.last_name;
                //         user.user_role = data.user_role;
                //     });

                // console.log(this.users);
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

        this.userService
            .saveRole(role, user)
            .subscribe({
                next: (data: any) => {
                    evt.target.checked ?
                        user.user_role.push(data.raw[0]) :
                        user.user_role = user.user_role.filter((user_role: any) => user_role.role_pk != role.pk);
                },
                error: (error: any) => {
                    console.log(error);
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

    resetPasswordModal(user: any) {
        const title = 'Reset Password';

        const initialState: ModalOptions = {
            class: 'modal-md',
            initialState: {
                title: title,
                user: user,
            }
        };
        this.bsModalRef = this.modalService.show(ResetPasswordModalComponent, initialState);
        this.bsModalRef.content.saveBtnName = 'Save';
        this.bsModalRef.content.closeBtnName = 'Close';

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

    suspend(user: any) {
        _.confirmMessage({
            title: '<strong>Are you sure you want to ' + (user.account.active ? 'lock' : 'unlock') + ' this account? ' + user.first_name + (user.account.active ? ' will no longer be able to log in' : ' will now be able to login') + '.</strong>',
            icon: 'question',
            buttons: {
                showClose: true,
                showCancel: true,
                focusConfirm: false
            },
            confirmButtonText: '<i class="fa fa-' + (user.account.active ? 'lock' : 'unlock') + '"></i> ' + (user.account.active ? 'Lock' : 'Unlock'),
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel'
        }, () => {
            this.userService
                .suspend(user.pk, { active: !user.account.active })
                .subscribe({
                    next: (data: any) => {
                        user.account.active = !user.account.active;
                    },
                    error: (error: any) => {
                        console.log(error);
                    },
                    complete: () => {

                    }
                });
        });
    }

    deactivate(user: any) {
        _.confirmMessage({
            title: '<strong>Are you sure you want to ' + (user.account.archived ? 'activate' : 'deactivate') + ' this account?</strong>',
            icon: 'question',
            buttons: {
                showClose: true,
                showCancel: true,
                focusConfirm: false
            },
            confirmButtonText: '<i class="fa fa-' + (user.account.archived ? 'undo' : 'trash') + '"></i> ' + (user.account.archived ? 'Activate' : 'Deactivate'),
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel'
        }, () => {
            this.userService
                .suspend(user.pk, { archived: !user.account.archived })
                .subscribe({
                    next: (data: any) => {
                        user.account.archived = !user.account.archived;
                    },
                    error: (error: any) => {
                        console.log(error);
                    },
                    complete: () => {

                    }
                });
        });
    }

    showLogs(user: any) {
        const title = 'User logs';
        user.entity = 'users';
        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                title: title,
                module: user
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

    onTableDataChange(event: any) {
        this.pagination.page = event;
        this.fetch();
    }

    onTableSizeChange(event: any): void {
        this.pagination.tableSize = event.target.value;
        this.pagination.page = 1;
        this.fetch();
    }

    roleUpdate(ev: any, i: number) {
        this.userService
            .saveRole(this.users[i].pk, ev)
            .subscribe({
                next: (data: any) => {

                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    // this.toastr.success('The user\'s roles have been updated successfully.', 'SUCCESS!');
                }
            });
    }
}
