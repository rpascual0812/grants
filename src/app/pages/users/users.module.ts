import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { UsersComponent } from './users.component';
import { UsersModalComponent } from './users-modal/users-modal.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { ResetPasswordModalComponent } from './reset-password-modal/reset-password-modal.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    declarations: [
        UsersComponent,
        UsersModalComponent,
        ResetPasswordModalComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule.forRoot(),
        NgxPaginationModule,
        ClipboardModule,
        ComponentsModule,
    ]
})
export class UsersModule { }
