import { Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { ApplicationsComponent } from 'src/app/pages/applications/applications.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { GrantsComponent } from 'src/app/pages/grants/grants.component';
import { PartnersComponent } from 'src/app/pages/partners/partners.component';
import { ReportsComponent } from 'src/app/pages/reports/reports.component';
import { SettingsComponent } from 'src/app/pages/settings/settings.component';
import { UsersComponent } from 'src/app/pages/users/users.component';

export const MainLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'grants', component: GrantsComponent, canActivate: [authGuard] },
    { path: 'applications', component: ApplicationsComponent, canActivate: [authGuard] },
    { path: 'partners', component: PartnersComponent, canActivate: [authGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
    { path: 'users', component: UsersComponent, canActivate: [authGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
];
