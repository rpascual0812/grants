import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerViewComponent } from './partner-view.component';
import { RouterModule } from '@angular/router';
import { PartnerInformationModule } from './modules/partner-information/partner-information.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { OrganizationProfileModule } from './modules/organization-profile/organization-profile.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { NonProfitEquivalencyDeterminationModule } from './modules/non-profit-equivalency-determination/non-profit-equivalency-determination.module';
import { OtherInfoModule } from './modules/other-info/other-info.module';


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
        OtherInfoModule,
        AccordionModule.forRoot(),
    ],
})
export class PartnerViewModule {}
