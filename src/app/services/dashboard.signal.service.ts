import { Injectable, signal, inject } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DashboardSignalService {
    public overallStatusSaved = signal(false);

    constructor() { }

    navigateNext() {

    }
}
