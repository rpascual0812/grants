import { Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';
import { UsersComponent } from '../users/users.component';
import { RolesComponent } from './roles/roles.component';
import { LinksComponent } from './links/links.component';

export const SettingsRoutes: Routes = [
    { path: 'users', component: UsersComponent, canActivate: [authGuard] },
    { path: 'donors', component: RolesComponent, canActivate: [authGuard] },
    { path: 'roles', component: RolesComponent, canActivate: [authGuard] },
    { path: 'links', component: LinksComponent, canActivate: [authGuard] },
];
