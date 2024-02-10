import { Routes } from '@angular/router';
import { ApplicationAuthComponent } from 'src/app/pages/applications/application-auth/application-auth.component';
import { ApplicationStatusComponent } from 'src/app/pages/applications/application-status/application-status.component';
import { ApplicationsComponent } from 'src/app/pages/applications/applications.component';

export const PublicLayoutRoutes: Routes = [
    { path: 'application/auth', component: ApplicationAuthComponent },
    { path: 'application/status', component: ApplicationStatusComponent },
    { path: 'application/:uuid', component: ApplicationsComponent },
];
