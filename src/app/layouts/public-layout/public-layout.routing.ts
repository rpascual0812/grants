import { Routes } from '@angular/router';
import { ApplicationAuthComponent } from 'src/app/pages/applications/application-auth/application-auth.component';
import { ApplicationNewComponent } from 'src/app/pages/applications/application-new/application-new.component';
import { ApplicationProjInfoComponent } from 'src/app/pages/applications/application-proj-info/application-proj-info.component';
import { ApplicationStatusComponent } from 'src/app/pages/applications/application-status/application-status.component';

export const PublicLayoutRoutes: Routes = [
    { path: 'application/auth', component: ApplicationAuthComponent },
    { path: 'application/status', component: ApplicationStatusComponent },
    { path: 'application/:uuid', component: ApplicationNewComponent },
    { path: 'application/:uuid/information', component: ApplicationProjInfoComponent },
];
