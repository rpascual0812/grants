import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonProfitEquivalencyDeterminationComponent } from './non-profit-equivalency-determination.component';
import { AttachDocumentsModule } from '../attach-documents/attach-documents.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputDropdownModule } from '../input-dropdown/input-dropdown.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [NonProfitEquivalencyDeterminationComponent],
    exports: [NonProfitEquivalencyDeterminationComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, AttachDocumentsModule, SelectModule, InputDropdownModule],
})
export class NonProfitEquivalencyDeterminationModule {}
