import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications.component';
import { ApplicationsListModule } from './applications-list/applications-list.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { LinkGeneratorModule } from 'src/app/components/link-generator/link-generator.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ApplicationsComponent],
    imports: [
        CommonModule,
        ApplicationsListModule,
        SelectModule,
        LinkGeneratorModule,
        AccordionModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class ApplicationsModule { }
