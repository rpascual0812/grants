import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInfoReferencesComponent } from './contact-info-references.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ContactInfoReferencesComponent],
  exports: [ContactInfoReferencesComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ContactInfoReferencesModule {}
