import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationProfileComponent } from './organization-profile.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AttachDocumentsModule } from '../attach-documents/attach-documents.module';

@NgModule({
  declarations: [OrganizationProfileComponent],
  exports: [OrganizationProfileComponent],
  imports: [
    CommonModule,
    SelectModule,
    AttachDocumentsModule,
    NgSelectModule
  ]
})
export class OrganizationProfileModule { }
