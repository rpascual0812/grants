import { Routes } from '@angular/router';
import { nonAuthGuard } from 'src/app/guards/non-auth.guard';
import { ForgotPasswordComponent } from 'src/app/pages/forgot-password/forgot-password.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { ResetPasswordComponent } from 'src/app/pages/reset-password/reset-password.component';

export const AuthLayoutRoutes: Routes = [
    { path: '', component: LoginComponent, canActivate: [nonAuthGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [nonAuthGuard] },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
];
