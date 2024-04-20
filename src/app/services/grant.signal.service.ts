import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GrantSignalService {
    public editSectionKey = signal<null | string>(null);
    constructor() {}
}
