import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';
import { SelectModule } from 'src/app/components/select/select.module';

import { UsersComponent } from './users.component';
import { UsersModalComponent } from './users-modal/users-modal.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { ResetPasswordModalComponent } from './reset-password-modal/reset-password-modal.component';
import { ComponentsModule } from 'src/app/components/components.module';

import { ModalComponent } from '../../components/modal/modal.component';

@NgModule({
    declarations: [
        UsersComponent,
        UsersModalComponent,
        ResetPasswordModalComponent,
        ModalComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule.forRoot(),
        NgxPaginationModule,
        ClipboardModule,
        ComponentsModule,
        SelectModule
    ]
})
export class UsersModule { }
