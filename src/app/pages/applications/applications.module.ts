import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications.component';
import { ApplicationsListModule } from './applications-list/applications-list.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NewApplicationModalComponent } from './applications-list/modules/new-application-modal/new-application-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ApplicationsComponent, NewApplicationModalComponent],
  imports: [
    CommonModule,
    ApplicationsListModule,
    SelectModule,
    AccordionModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,],
})
export class ApplicationsModule { }
