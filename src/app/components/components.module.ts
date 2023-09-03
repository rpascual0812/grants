import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

import { PasswordGeneratorComponent } from './password-generator/password-generator.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { LogsComponent } from './logs/logs.component';

@NgModule({
    imports: [
        CommonModule,
        // BrowserModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule
    ],
    declarations: [
        NavbarComponent,
        SidebarComponent,
        FooterComponent,

        PasswordGeneratorComponent,
        FileUploaderComponent,
        PermissionsComponent,
        LogsComponent
    ],
    exports: [
        NavbarComponent,
        SidebarComponent,
        FooterComponent,
        PasswordGeneratorComponent,
        PermissionsComponent,
        LogsComponent
    ],
    providers: [

    ]
})
export class ComponentsModule { }
