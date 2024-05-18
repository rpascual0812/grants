import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailTemplatesComponent } from './email-templates.component';
import { TextEditorModule } from 'src/app/components/text-editor/text-editor.module';

@NgModule({
    declarations: [
        EmailTemplatesComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TextEditorModule
    ]
})
export class EmailTemplatesModule { }
