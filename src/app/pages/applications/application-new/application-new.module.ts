import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationNewComponent } from './application-new.component';
import { ProponentInformationModule } from './modules/proponent-information/proponent-information.module';
import { OrganizationProfileModule } from './modules/organization-profile/organization-profile.module';
import { ProjectInformationModule } from './modules/project-information/project-information.module';
import { ProposedActivitiesTimelinesModule } from './modules/proposed-activities-timelines/proposed-activities-timelines.module';
import { NonProfitEquivalencyDeterminationModule } from './modules/non-profit-equivalency-determination/non-profit-equivalency-determination.module';
import { FiscalSponsorInformationModule } from './modules/fiscal-sponsor-information/fiscal-sponsor-information.module';
import { ContactInfoReferencesModule } from './modules/contact-info-references/contact-info-references.module';

@NgModule({
  declarations: [
    ApplicationNewComponent
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
export class ApplicationNewModule { }
