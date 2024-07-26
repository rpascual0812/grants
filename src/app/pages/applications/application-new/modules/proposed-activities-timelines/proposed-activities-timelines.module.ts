import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposedActivitiesTimelinesComponent } from './proposed-activities-timelines.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { AttachDocumentsModule } from '../attach-documents/attach-documents.module';
import { InputDropdownModule } from '../../../../../components/input-dropdown/input-dropdown.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProposedActivitiesTimelinesComponent],
  exports: [ProposedActivitiesTimelinesComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, AttachDocumentsModule, InputDropdownModule],
})
export class ProposedActivitiesTimelinesModule {}
