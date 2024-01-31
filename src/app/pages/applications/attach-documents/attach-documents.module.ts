import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachDocumentsComponent } from './attach-documents.component';

@NgModule({
  declarations: [AttachDocumentsComponent],
  exports: [AttachDocumentsComponent],
  imports: [CommonModule],
})
export class AttachDocumentsModule {}
