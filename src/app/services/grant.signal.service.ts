import { Injectable, signal } from '@angular/core';
import { ProjectAssessment } from '../interfaces/_application.interface';
import { Project, ProjectSite } from '../interfaces/_project.interface';

export interface ProjectForm extends Project {
    project?: Project;
    projectAssessment?: ProjectAssessment;
    projectSite?: ProjectSite[];
}

@Injectable({
    providedIn: 'root',
})
export class GrantSignalService {
    public editSectionKey = signal<null | string>(null);
    public project = signal<Project | null>(null);
    constructor() { }
}
