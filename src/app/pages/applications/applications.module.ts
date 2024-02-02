import { FiscalSponsorInformationModule } from './fiscal-sponsor-information/fiscal-sponsor-information.module';
import { NonProfitEquivalencyDeterminationModule } from './non-profit-equivalency-determination/non-profit-equivalency-determination.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications.component';
import { ProponentInformationModule } from './proponent-information/proponent-information.module';
import { OrganizationProfileModule } from './organization-profile/organization-profile.module';
import { ProjectInformationModule } from './project-information/project-information.module';
import { ProposedActivitiesTimelinesModule } from './proposed-activities-timelines/proposed-activities-timelines.module';
import { ContactInfoReferencesModule } from './contact-info-references/contact-info-references.module';
@NgModule({
    declarations: [
        ApplicationsComponent,
    ],
    imports: [
        CommonModule,
        ProponentInformationModule,
        OrganizationProfileModule,
        ProjectInformationModule,
        ProposedActivitiesTimelinesModule,
        NonProfitEquivalencyDeterminationModule,
        FiscalSponsorInformationModule,
        ContactInfoReferencesModule
    ]
})
export class ApplicationsModule { }