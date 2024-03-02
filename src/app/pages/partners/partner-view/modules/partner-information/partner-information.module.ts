import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerInformationComponent } from './partner-information.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@NgModule({
    declarations: [PartnerInformationComponent],
    exports: [PartnerInformationComponent],
    imports: [CommonModule],
})
export class PartnerInformationModule {}
