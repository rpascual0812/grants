import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

import { PasswordGeneratorComponent } from './password-generator/password-generator.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';

@NgModule({
    imports: [
        CommonModule,
        // BrowserModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        NavbarComponent,
        SidebarComponent,
        FooterComponent,

        PasswordGeneratorComponent,
        FileUploaderComponent
    ],
    exports: [
        NavbarComponent,
        SidebarComponent,
        FooterComponent,
        PasswordGeneratorComponent
    ],
    providers: [

    ]
})
export class ComponentsModule { }
