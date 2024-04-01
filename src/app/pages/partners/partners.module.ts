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
import { InputDropdownModule } from '../applications/application-new/modules/input-dropdown/input-dropdown.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OrgBankAccountComponent } from './modals/modal-views/org-bank-account/org-bank-account.component';

@NgModule({
    declarations: [
        PartnersComponent,
        PartnerEditModalComponent,
        PartnerInfoViewComponent,
        OrgProfileViewComponent,
        NonProfitEquivalDeterViewComponent,
        OrgBankAccountComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SelectModule,
        PartnersListModule,
        InputDropdownModule,
        BsDatepickerModule.forRoot(),
    ],
})
export class PartnersModule {}
