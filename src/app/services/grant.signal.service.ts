import { Injectable, signal } from '@angular/core';
import { PartnerAssessment } from '../interfaces/_application.interface';
import { Project } from '../interfaces/_project.interface';

export interface ProjectForm extends Project {
    project?: Project;
    partnerAssessment?: PartnerAssessment;
}

@Injectable({
    providedIn: 'root',
})
export class GrantSignalService {
    public editSectionKey = signal<null | string>(null);
    public project = signal<Project | null>(null);
    constructor() {}
}
