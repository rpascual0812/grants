import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LinkGeneratorComponent } from './link-generator.component';
import { SelectModule } from '../select/select.module';

@NgModule({
    declarations: [
        LinkGeneratorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule
    ],
    exports: [
        LinkGeneratorComponent
    ]
})
export class LinkGeneratorModule { }
