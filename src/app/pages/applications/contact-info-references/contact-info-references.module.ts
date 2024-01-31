import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInfoReferencesComponent } from './contact-info-references.component';

@NgModule({
  declarations: [ContactInfoReferencesComponent],
  exports: [ContactInfoReferencesComponent],
  imports: [CommonModule],
})
export class ContactInfoReferencesModule {}
