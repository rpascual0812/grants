import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { MainLayoutRoutes } from './main-layout.routing';
import { UsersModule } from 'src/app/pages/users/users.module';
import { RolesModule } from 'src/app/pages/settings/roles/roles.module';
import { ApplicationsModule } from 'src/app/pages/applications/applications.module';
import { PartnersModule } from 'src/app/pages/partners/partners.module';
import { PartnerViewModule } from 'src/app/pages/partners/partner-view/partner-view.module';
import { ApplicationReviewModule } from 'src/app/pages/applications/application-review/application-review.module';
import { GrantsModule } from 'src/app/pages/grants/grants.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MainLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        ApplicationsModule,
        GrantsModule,
        ApplicationReviewModule,
        PartnersModule,
        PartnerViewModule,
        UsersModule,
        RolesModule
    ],
    declarations: [

    ],

})
export class MainLayoutModule { }
