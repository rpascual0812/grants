import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        ComponentsModule
    ]
})
export class ResetPasswordModule { }
