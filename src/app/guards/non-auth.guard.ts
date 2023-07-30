import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { DateTime } from 'luxon';

export const nonAuthGuard: CanActivateFn = (route, state) => {
    const token = localStorage.getItem('o__token');
    const router = inject(Router);

    if (token) {
        const exp = (JSON.parse(atob(token.split('.')[1]))).exp;

        if ((exp * 1000) > DateTime.now().toMillis()) {
            router.navigate(['/dashboard']);
            return false;
        }

        return true;
    }

    return true;
}