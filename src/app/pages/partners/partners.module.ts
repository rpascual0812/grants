import { NonProfitEquivalencyDeterminationModule } from './partner-view/modules/non-profit-equivalency-determination/non-profit-equivalency-determination.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersComponent } from './partners.component';
import { PartnersListModule } from './partners-list/partners-list.module';
import { PartnerEditModalComponent } from './modals/partner-edit-modal/partner-edit-modal.component';
import { PartnerInfoViewComponent } from './modals/modal-views/partner-info-view/partner-info-view.component';
import { OrgProfileViewComponent } from './modals/modal-views/org-profile-view/org-profile-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'src/app/components/select/select.module';
import { NonProfitEquivalDeterViewComponent } from './modals/modal-views/non-profit-equival-deter-view/non-profit-equival-deter-view.component';
import { InputDropdownModule } from '../../components/input-dropdown/input-dropdown.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AssessmentComponent } from './modals/modal-views/assessment/assessment.component';
import { OrgBankAccountComponent } from './modals/modal-views/org-bank-account-view/org-bank-account.component';
import { PartnerAddComponent } from './modals/partner-add/partner-add.component';
import { ProponentInformationModule } from '../applications/application-new/modules/proponent-information/proponent-information.module';
import { OrganizationProfileModule } from '../applications/application-new/modules/organization-profile/organization-profile.module';
import { NonProfitEquivalencyDeterminationModule as NonProfitEqDeterModule } from '../applications/application-new/modules/non-profit-equivalency-determination/non-profit-equivalency-determination.module';
import { FiscalSponsorInformationModule } from '../applications/application-new/modules/fiscal-sponsor-information/fiscal-sponsor-information.module';
import { ContactInfoReferencesModule } from '../applications/application-new/modules/contact-info-references/contact-info-references.module';


@NgModule({
    declarations: [
        PartnersComponent,
        PartnerEditModalComponent,
        PartnerInfoViewComponent,
        OrgProfileViewComponent,
        NonProfitEquivalDeterViewComponent,
        OrgBankAccountComponent,
        AssessmentComponent,
        PartnerAddComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SelectModule,
        PartnersListModule,
        InputDropdownModule,
        BsDatepickerModule.forRoot(),
        ProponentInformationModule,
        OrganizationProfileModule,
        NonProfitEqDeterModule,
        FiscalSponsorInformationModule,
        ContactInfoReferencesModule
    ],
})
export class PartnersModule {}
