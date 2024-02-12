import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiscalSponsorInformationComponent } from './fiscal-sponsor-information.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { AttachDocumentsModule } from '../attach-documents/attach-documents.module';

@NgModule({
  declarations: [FiscalSponsorInformationComponent],
  exports: [FiscalSponsorInformationComponent],
  imports: [CommonModule, SelectModule, AttachDocumentsModule],
})
export class FiscalSponsorInformationModule {}
