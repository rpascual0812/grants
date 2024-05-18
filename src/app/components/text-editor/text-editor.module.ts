import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextEditorComponent } from './text-editor.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@NgModule({
    declarations: [
        TextEditorComponent
    ],
    imports: [
        CommonModule,
        EditorModule
    ],
    providers: [
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
    ],
    exports: [
        TextEditorComponent
    ]
})
export class TextEditorModule { }
