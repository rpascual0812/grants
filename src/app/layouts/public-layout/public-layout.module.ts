import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { PublicLayoutRoutes } from './public-layout.routing';
import { ApplicationStatusModule } from 'src/app/pages/applications/application-status/application-status.module';
import { ApplicationAuthModule } from 'src/app/pages/applications/application-auth/application-auth.module';
import { ApplicationNewModule } from 'src/app/pages/applications/application-new/application-new.module';
import { ApplicationProjInfoModule } from 'src/app/pages/applications/application-proj-info/application-proj-info.module';
import { ApplicationSuccessModule } from 'src/app/pages/applications/application-success/application-success.module';
import { DataCollectionModule } from 'src/app/pages/applications/data-collection/data-collection.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PublicLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        ApplicationNewModule,
        ApplicationSuccessModule,
        ApplicationStatusModule,
        ApplicationAuthModule,
        ApplicationProjInfoModule,
        DataCollectionModule,
        NgSelectModule,
        HttpClientModule
    ],
    declarations: [],
})
export class PublicLayoutModule { }
