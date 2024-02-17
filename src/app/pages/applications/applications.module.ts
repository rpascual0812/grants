import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications.component';
import { ApplicationsListModule } from './applications-list/applications-list.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
@NgModule({
    declarations: [
        ApplicationsComponent,
    ],
    imports: [
        CommonModule,
        ApplicationsListModule,
        SelectModule,
        AccordionModule.forRoot()
    ]
})
export class ApplicationsModule { }