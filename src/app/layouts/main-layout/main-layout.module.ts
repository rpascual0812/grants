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
import { LinksModule } from 'src/app/pages/settings/links/links.module';
import { GrantViewModule } from 'src/app/pages/grants/grant-view/grant-view.module';

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
        GrantViewModule,
        ApplicationReviewModule,
        PartnersModule,
        PartnerViewModule,
        UsersModule,
        RolesModule,
        LinksModule
    ],
    declarations: [

    ],

})
export class MainLayoutModule { }
