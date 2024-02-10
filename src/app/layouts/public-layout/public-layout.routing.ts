import { Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { ApplicationAuthComponent } from 'src/app/pages/applications/application-auth/application-auth.component';
import { ApplicationStatusComponent } from 'src/app/pages/applications/application-status/application-status.component';

export const PublicLayoutRoutes: Routes = [
    { path: 'application/auth', component: ApplicationAuthComponent },
    { path: 'application/status', component: ApplicationStatusComponent },
];
