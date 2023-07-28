import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import * as _ from '../../utilities/globals';
import { UsersModalComponent } from './users-modal/users-modal.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent {
    bsModalRef?: BsModalRef;

    users: any = [
        {
            username: 'admin',
            fullname: 'Rafael Pascual',
            email: 'rpascual0812@gmail.com',
            roles: {}
        },
        {
            username: 'rpascual',
            fullname: 'Rafael A. Pascual',
            email: 'rpascual0812@gmail.com',
            roles: {}
        }
    ];

    pagination: any = {
        page: 1,
        count: 0,
        tableSize: 10
    };
    tableSizes = _.TABLE_SIZES;

    constructor(
        private formBuilder: FormBuilder,
        private modalService: BsModalService
    ) {

    }

    fetch() {

    }

    addNewModal(user: any) {
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
}
