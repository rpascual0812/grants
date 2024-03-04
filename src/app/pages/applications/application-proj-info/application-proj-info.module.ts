import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationProjInfoComponent } from './application-proj-info.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputDropdownModule } from '../application-new/modules/input-dropdown/input-dropdown.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AttachDocumentsModule } from '../application-new/modules/attach-documents/attach-documents.module';



@NgModule({
  declarations: [
    ApplicationProjInfoComponent
  ],
  imports: [
    CommonModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    InputDropdownModule,
    AttachDocumentsModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class ApplicationProjInfoModule { }
