import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthLayoutRoutes } from './auth-layout.routing';

import { LoginModule } from 'src/app/pages/login/login.module';
import { ForgotPasswordModule } from 'src/app/pages/forgot-password/forgot-password.module';
import { ResetPasswordModule } from 'src/app/pages/reset-password/reset-password.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,

        LoginModule,
        ForgotPasswordModule,
        ResetPasswordModule
    ],
    declarations: [

    ],
    exports: [
    ]
})
export class AuthLayoutModule { }
