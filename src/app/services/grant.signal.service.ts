import { Injectable, signal } from '@angular/core';
import { PartnerAssessment, Project } from '../interfaces/_application.interface';

export interface ProjectForm extends Project {
    project?: Project;
    partnerAssessment?: PartnerAssessment;
}

@Injectable({
    providedIn: 'root',
})
export class GrantSignalService {
    public editSectionKey = signal<null | string>(null);
    constructor() { }
}
