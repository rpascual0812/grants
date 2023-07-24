import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { UsersModalComponent } from './users-modal/users-modal.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [
        UsersComponent,
        UsersModalComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule.forRoot(),
    ]
})
export class UsersModule { }
