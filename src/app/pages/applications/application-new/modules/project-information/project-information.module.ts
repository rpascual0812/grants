import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectInformationComponent } from './project-information.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { AttachDocumentsModule } from '../attach-documents/attach-documents.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ProjectInformationComponent],
    exports: [ProjectInformationComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, AttachDocumentsModule],
})
export class ProjectInformationModule {}
