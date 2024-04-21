import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Application, Country, Province } from 'src/app/interfaces/_application.interface';
import { Project } from 'src/app/interfaces/_project.interface';

export const PROJECT_EDIT_MODAL_TITLE_MAPPER = {
    projectInformation: `Project Information`,
    activitiesAndTimeline: `Activities and Timeline`,
};

export type ProjectEditModalTitleMapperKey = keyof typeof PROJECT_EDIT_MODAL_TITLE_MAPPER;

@Component({
    selector: 'app-project-edit-modal',
    templateUrl: './project-edit-modal.component.html',
    styleUrls: ['./project-edit-modal.component.scss'],
})
export class ProjectEditModalComponent {
    project: Project | null = null;
    section: ProjectEditModalTitleMapperKey | null = null;
    provinces: Province[] = [];
    countries: Country[] = [];
    modalTitle = '';

    constructor(public bsModalRef: BsModalRef, modalService: BsModalService) {
        this.section = (modalService?.config?.initialState as any)?.section;
        this.project = (modalService?.config?.initialState as any)?.project;
        this.provinces = (modalService?.config?.initialState as any)?.provinces;
        this.countries = (modalService?.config?.initialState as any)?.countries;
        this.modalTitle = PROJECT_EDIT_MODAL_TITLE_MAPPER?.[this.section as ProjectEditModalTitleMapperKey] ?? '';
    }
}
