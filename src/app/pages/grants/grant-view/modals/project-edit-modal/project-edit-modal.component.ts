import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Application, Country, Province } from 'src/app/interfaces/_application.interface';

export const PROJECT_EDIT_MODAL_TITLE_MAPPER = {
    projectInformation: `Project Information`,
};

export type ProjectEditModalTitleMapperKey = keyof typeof PROJECT_EDIT_MODAL_TITLE_MAPPER;

@Component({
    selector: 'app-project-edit-modal',
    templateUrl: './project-edit-modal.component.html',
    styleUrls: ['./project-edit-modal.component.scss'],
})
export class ProjectEditModalComponent {
    application: Application | null = null;
    section: ProjectEditModalTitleMapperKey | null = null;
    provinces: Province[] = [];
    countries: Country[] = [];
    modalTitle = '';

    constructor(public bsModalRef: BsModalRef, modalService: BsModalService) {
        this.section = (modalService?.config?.initialState as any)?.section;
        this.application = (modalService?.config?.initialState as any)?.application;
        this.provinces = (modalService?.config?.initialState as any)?.provinces;
        this.countries = (modalService?.config?.initialState as any)?.countries;
        this.modalTitle = PROJECT_EDIT_MODAL_TITLE_MAPPER?.[this.section as ProjectEditModalTitleMapperKey] ?? '';
    }
}
