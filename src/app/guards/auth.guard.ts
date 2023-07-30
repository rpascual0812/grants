import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { DateTime } from 'luxon';

export const authGuard: CanActivateFn = (route, state) => {
    const token = localStorage.getItem('o__token');
    const router = inject(Router);

    if (token) {
        const exp = (JSON.parse(atob(token.split('.')[1]))).exp;
        if ((exp * 1000) > DateTime.now().toMillis()) {
            return true;
        }
        router.navigate(['/auth']);
        return false;
    }

    router.navigate(['/auth']);
    return false;
}