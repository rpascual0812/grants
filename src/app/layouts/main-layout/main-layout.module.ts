import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { MainLayoutRoutes } from './main-layout.routing';
import { UsersModule } from 'src/app/pages/users/users.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MainLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        UsersModule,
        ModalModule.forRoot()
    ],
    declarations: [

    ],

})
export class MainLayoutModule { }
