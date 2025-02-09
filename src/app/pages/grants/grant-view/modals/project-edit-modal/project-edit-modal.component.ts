import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Country, ProjectAssessment, Province } from 'src/app/interfaces/_application.interface';
import { Project, ProjectSite } from 'src/app/interfaces/_project.interface';
import { PROJECT_EDIT_SECTION_MAPPER, ProjectEditSectionMapperKey } from '../../grant-view.component';

@Component({
    selector: 'app-project-edit-modal',
    templateUrl: './project-edit-modal.component.html',
    styleUrls: ['./project-edit-modal.component.scss'],
})
export class ProjectEditModalComponent {
    project: Project | null = null;
    section: ProjectEditSectionMapperKey | null = null;
    projectAssessment: ProjectAssessment | null = null;
    provinces: Province[] = [];
    countries: Country[] = [];
    projectSite: ProjectSite[] = [];
    modalTitle = '';

    constructor(public bsModalRef: BsModalRef, modalService: BsModalService) {
        this.section = (modalService?.config?.initialState as any)?.section;
        this.projectAssessment = (modalService?.config?.initialState as any)?.projectAssessment;
        this.project = (modalService?.config?.initialState as any)?.project;
        this.provinces = (modalService?.config?.initialState as any)?.provinces;
        this.countries = (modalService?.config?.initialState as any)?.countries;
        this.projectSite = (modalService?.config?.initialState as any)?.projectSite;
        this.modalTitle = PROJECT_EDIT_SECTION_MAPPER?.[this.section as ProjectEditSectionMapperKey] ?? '';
    }
}
