import { Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { ApplicationStatusComponent } from 'src/app/pages/applications/application-status/application-status.component';

export const PublicLayoutRoutes: Routes = [
    { path: 'application/auth', component: ApplicationStatusComponent },
    { path: 'application/status', component: ApplicationStatusComponent },
];
