import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersListComponent } from './partners-list.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SelectModule } from 'src/app/components/select/select.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [PartnersListComponent],
    exports: [PartnersListComponent],
    imports: [
        CommonModule, 
        FormsModule, 
        NgxPaginationModule, 
        AccordionModule.forRoot(), 
        SelectModule, 
        RouterModule,
    ],
})
export class PartnersListModule {}
