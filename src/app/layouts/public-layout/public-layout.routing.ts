import { Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { ApplicationStatusComponent } from 'src/app/pages/applications/application-status/application-status.component';

export const MainLayoutRoutes: Routes = [
    { path: 'application-status', component: ApplicationStatusComponent },
];
