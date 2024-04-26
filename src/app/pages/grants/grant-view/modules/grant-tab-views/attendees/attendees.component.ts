import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
    selector: 'app-attendees',
    templateUrl: './attendees.component.html',
    styleUrls: ['./attendees.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AttendeesComponent implements OnInit {
    events: any = [];
    loading: boolean = false;

    project: Project | null = null;

    grantSignalService = inject(GrantSignalService);

    currentExpandedIdx = -1
    mockRandomEvent: number[] = []
    constructor(
        private projectService: ProjectService
    ) {
        for (let i = 0; i < 10; i++) {
            this.mockRandomEvent.push(i)
        }
    }

    ngOnInit(): void {
        this.project = this.grantSignalService.project();
        this.fetch();
    }

    handleIsOpenChange($event: boolean, idx: number) {
        if ($event) {
            this.currentExpandedIdx = idx
        } else {
            this.currentExpandedIdx = -1
        }
    }

    fetch() {
        this.projectService
            .fetchEvents(this.project?.pk)
            .subscribe({
                next: (data: any) => {
                    this.events = data.data;
                    console.log('events', this.events);
                },
                error: (error: any) => {
                    console.log(error);
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                }
            });
    }
}
