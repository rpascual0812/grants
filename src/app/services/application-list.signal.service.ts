import { Injectable, signal } from '@angular/core';

interface AppListFilters {
    type_pk?: number;
}

@Injectable({
    providedIn: 'root',
})
export class ApplicationListSignalService {
    public filters = signal<AppListFilters | null>(null);
    public applyFilter = signal<boolean>(false)
    constructor() {}
}
