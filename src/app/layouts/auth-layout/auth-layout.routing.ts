import { Routes } from '@angular/router';
import { nonAuthGuard } from 'src/app/guards/non-auth.guard';
import { LoginComponent } from 'src/app/pages/login/login.component';


export const AuthLayoutRoutes: Routes = [
    { path: '', component: LoginComponent, canActivate: [nonAuthGuard] },
];
