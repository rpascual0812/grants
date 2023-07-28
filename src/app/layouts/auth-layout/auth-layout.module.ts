import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthLayoutRoutes } from './auth-layout.routing';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { ForgotPasswordComponent } from 'src/app/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'src/app/pages/reset-password/reset-password.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ],
    exports: [
    ]
})
export class AuthLayoutModule { }
