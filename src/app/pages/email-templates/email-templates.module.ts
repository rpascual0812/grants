import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmailTemplatesComponent } from './email-templates.component';
import { TextEditorModule } from 'src/app/components/text-editor/text-editor.module';
import { EmailTemplatePreviewModule } from './email-template-preview/email-template-preview.module';
import { SelectModule } from 'src/app/components/select/select.module';

@NgModule({
    declarations: [
        EmailTemplatesComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TextEditorModule,
        EmailTemplatePreviewModule,
        SelectModule
    ]
})
export class EmailTemplatesModule { }
