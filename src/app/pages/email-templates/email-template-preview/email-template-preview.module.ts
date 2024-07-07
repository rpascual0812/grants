import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplatePreviewComponent } from './email-template-preview.component';
import { TextEditorModule } from 'src/app/components/text-editor/text-editor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'src/app/components/select/select.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        EmailTemplatePreviewComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TextEditorModule,
        SelectModule,
        NgSelectModule
    ],
    exports: [EmailTemplatePreviewComponent]
})
export class EmailTemplatePreviewModule { }
