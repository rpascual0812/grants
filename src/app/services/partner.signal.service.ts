import { Injectable, signal } from '@angular/core';
import { Application, Partner } from '../interfaces/_application.interface';

export interface PartnerForm extends Partner {
    application?: Application[];
}

@Injectable({
    providedIn: 'root',
})
export class PartnerSignalService {
    public partnerForm = signal<PartnerForm | null>(null);
    public loadingInitialPartnerForm = signal(true);
    public editSectionKey = signal<null | string>(null);

    constructor() {}
}
