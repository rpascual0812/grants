import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationProfileComponent } from './organization-profile.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { AttachDocumentsModule } from '../attach-documents/attach-documents.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [OrganizationProfileComponent],
    exports: [OrganizationProfileComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, AttachDocumentsModule],
})
export class OrganizationProfileModule {}
