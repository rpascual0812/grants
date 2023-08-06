import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordGeneratorComponent } from './password-generator/password-generator.component';

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
        PasswordGeneratorComponent
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
