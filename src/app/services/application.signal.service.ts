import { Injectable, signal } from '@angular/core';
import { INITIAL_STEP, MAX_STEP } from '../pages/applications/application-new/application-new.component';
import { ApplicationCreate } from '../interfaces/application.interface';

@Injectable({
    providedIn: 'root',
})
export class ApplicationSignalService {
    public currentNavStep = signal(1);
    public application = signal<ApplicationCreate | null>(null);
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
