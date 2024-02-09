import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerViewComponent } from './partner-view.component';
import { RouterModule } from '@angular/router';
import { PartnerInformationModule } from '../partner-information/partner-information.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { OrganizationProfileModule } from '../organization-profile/organization-profile.module';
import { ProjectsModule } from '../projects/projects.module';
import { EvaluationsModule } from '../evaluations/evaluations.module';
import { NonProfitEquivalencyDeterminationModule } from '../non-profit-equivalency-determination/non-profit-equivalency-determination.module';

@NgModule({
    declarations: [PartnerViewComponent],
    exports: [PartnerViewComponent],
    imports: [
        CommonModule,
        RouterModule,
        PartnerInformationModule,
        OrganizationProfileModule,
        ProjectsModule,
        EvaluationsModule,
        NonProfitEquivalencyDeterminationModule,
        AccordionModule.forRoot(),
    ],
})
export class PartnerViewModule {}
