import { Injectable, signal, inject } from '@angular/core';
import { Application, Document } from '../interfaces/_application.interface';

@Injectable({
    providedIn: 'root',
})
export class ApplicationSignalService {
    public currentNavStep = signal(1);
    public submitSave = signal(false);
    public appForm = signal<Application | null>(null);
    public loadingInitialAppForm = signal(true);
    INITIAL_STEP = 0
    MAX_STEP = 0

    constructor() {}

    navigateNext() {
        const currentStep = this.currentNavStep();
        const nextStep = currentStep < this.MAX_STEP ? currentStep + 1 : currentStep;
        this.currentNavStep.set(nextStep);
    }

    navigateBack() {
        const currentNavStep = this.currentNavStep();
        const backStep = currentNavStep > this.INITIAL_STEP ? currentNavStep - 1 : currentNavStep;
        this.currentNavStep.set(backStep);
    }

    removeDocumentDuplicates(data: Document[]) {
        const uniqueData = [];
        const seen = new Set();

        for (const obj of data) {
            const key = `${obj.pk}-${obj.type}`;
            if (!seen.has(key)) {
                uniqueData.push(obj);
                seen.add(key);
            }
        }
        return uniqueData;
    }

    setDocuments(currentAttachments: Document[], documentType: string) {
        const currentApplication = this.appForm();
        const documents = currentApplication?.documents;

        const attachments =
            currentAttachments.map((attachment: any) => ({
                ...attachment,
                type: documentType,
            })) ?? [];

        const consolidatedDocuments = [...(documents ?? []), ...attachments];
        const uniqDocuments = this.removeDocumentDuplicates(consolidatedDocuments);

        this.appForm.set({
            ...currentApplication,
            documents: uniqDocuments,
        });
    }

    removeDocument(documentToBeRemoved: Partial<Document>) {
        const currentApplication = this.appForm();
        const documents = currentApplication?.documents;
        const uniqDocuments = documents?.filter((document) => document?.pk !== documentToBeRemoved?.pk)
        this.appForm.set({
            ...currentApplication,
            documents: uniqDocuments,
        });
    }
}
