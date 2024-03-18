import { Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { ApplicationsComponent } from 'src/app/pages/applications/applications.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { GrantsComponent } from 'src/app/pages/grants/grants.component';
import { PartnersComponent } from 'src/app/pages/partners/partners.component';
import { ReportsComponent } from 'src/app/pages/reports/reports.component';
import { RolesComponent } from 'src/app/pages/settings/roles/roles.component';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ApplicationReviewComponent } from 'src/app/pages/applications/application-review/application-review.component';
import { PartnerViewComponent } from 'src/app/pages/partners/partner-view/partner-view.component';

export const MainLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'grants', component: GrantsComponent, canActivate: [authGuard] },
    { path: 'applications', component: ApplicationsComponent, canActivate: [authGuard] },
    { path: 'applications/:number/review', component: ApplicationReviewComponent, canActivate: [authGuard] },
    { path: 'partners', component: PartnersComponent, canActivate: [authGuard] },
    { path: 'partner/:pk/information', component: PartnerViewComponent, canActivate: [authGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
    // { path: 'users', component: UsersComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'settings/users', component: UsersComponent, canActivate: [authGuard] },
    { path: 'settings/donors', component: RolesComponent, canActivate: [authGuard] },
    { path: 'settings/roles', component: RolesComponent, canActivate: [authGuard] },
];
