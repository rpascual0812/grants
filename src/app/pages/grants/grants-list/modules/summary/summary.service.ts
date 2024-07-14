import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Project } from 'src/app/interfaces/_project.interface';

type SummaryProjectList = {
    loading?: boolean;
    projects?: Project[];
};

@Injectable({
    providedIn: 'root',
})
export class SummaryService {
    currentProjectList: Subject<SummaryProjectList>;

    constructor() {
        this.currentProjectList = new Subject<SummaryProjectList>();
    }
}
