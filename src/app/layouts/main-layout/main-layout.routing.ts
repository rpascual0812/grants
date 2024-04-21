import { Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { ApplicationsComponent } from 'src/app/pages/applications/applications.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { GrantsComponent } from 'src/app/pages/grants/grants.component';
import { PartnersComponent } from 'src/app/pages/partners/partners.component';
import { ReportsComponent } from 'src/app/pages/reports/reports.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { ApplicationReviewComponent } from 'src/app/pages/applications/application-review/application-review.component';
import { PartnerViewComponent } from 'src/app/pages/partners/partner-view/partner-view.component';
import { GrantViewComponent } from 'src/app/pages/grants/grant-view/grant-view.component';

export const MainLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'grants', component: GrantsComponent, canActivate: [authGuard] },
    { path: 'grant/:pk/review', component: GrantViewComponent, canActivate: [authGuard] },
    { path: 'applications', component: ApplicationsComponent, canActivate: [authGuard] },
    { path: 'applications/:number/review', component: ApplicationReviewComponent, canActivate: [authGuard] },
    { path: 'partners', component: PartnersComponent, canActivate: [authGuard] },
    { path: 'partner/:partnerId/information', component: PartnerViewComponent, canActivate: [authGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    {
        path: 'settings',
        loadChildren: () => import('../../pages/settings/settings.module').then((m) => m.SettingsModule),
    },
];
