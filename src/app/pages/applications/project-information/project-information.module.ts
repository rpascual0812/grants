import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectInformationComponent } from './project-information.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { AttachDocumentsModule } from '../attach-documents/attach-documents.module';

@NgModule({
  declarations: [ProjectInformationComponent],
  exports: [ProjectInformationComponent],
  imports: [CommonModule, SelectModule, AttachDocumentsModule],
})
export class ProjectInformationModule {}
