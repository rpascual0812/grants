import { Injectable, signal } from '@angular/core';
import { INITIAL_STEP, MAX_STEP } from '../pages/applications/application-new/application-new.component';

// Interfaces
export interface Application {
    uuid?: string;
    proponent?: Proponent;
    organization_profile?: OrganizationProfile;
}

export interface OrganizationProfile {
    organization_pk?: number;
    mission?: string;
    vision?: string;
    description?: string;
    country_pk?: number;
    project_website?: string;
}

export interface Proponent {
    name?: string;
    address?: string;
    contact_number?: string;
    email_address?: string;
    website?: string;
}
@Injectable({
    providedIn: 'root',
})
export class ApplicationSignalService {
    public currentNavStep = signal(1);
    public application = signal<Application | null>(null);
    public submitSave = signal(false);

    constructor() {}

    navigateNext() {
        const currentStep = this.currentNavStep();
        const nextStep = currentStep < MAX_STEP ? currentStep + 1 : currentStep;
        this.currentNavStep.set(nextStep);
    }

    navigateBack() {
        const currentNavStep = this.currentNavStep();
        const backStep = currentNavStep > INITIAL_STEP ? currentNavStep - 1 : currentNavStep;
        this.currentNavStep.set(backStep);
    }
}
