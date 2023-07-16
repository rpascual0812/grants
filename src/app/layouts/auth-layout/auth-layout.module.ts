import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthLayoutRoutes } from './auth-layout.routing';
import { LoginComponent } from 'src/app/pages/login/login.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
      LoginComponent
    ],
    exports: [
    ]
})
export class AuthLayoutModule { }
