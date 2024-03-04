import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicLayoutRoutes } from './public-layout.routing';
import { ApplicationStatusModule } from 'src/app/pages/applications/application-status/application-status.module';
import { ApplicationAuthModule } from 'src/app/pages/applications/application-auth/application-auth.module';
import { ApplicationNewModule } from 'src/app/pages/applications/application-new/application-new.module';
import { ApplicationProjInfoModule } from 'src/app/pages/applications/application-proj-info/application-proj-info.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PublicLayoutRoutes),
        ApplicationNewModule,
        ApplicationStatusModule,
        ApplicationAuthModule,
        ApplicationProjInfoModule
    ],
    declarations: [],
})
export class PublicLayoutModule { }
