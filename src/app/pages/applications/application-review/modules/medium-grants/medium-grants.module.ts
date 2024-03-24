import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediumGrantsComponent } from './medium-grants.component';
import { AttachDocumentsModule } from '../../../application-new/modules/attach-documents/attach-documents.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        MediumGrantsComponent
    ],
    exports: [
        MediumGrantsComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        AttachDocumentsModule
    ]
})
export class MediumGrantsModule { }
