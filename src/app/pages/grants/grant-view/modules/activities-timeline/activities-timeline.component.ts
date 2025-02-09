import { ChangeDetectorRef, Component, Input, OnInit, effect, inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { getOtherCurrencyKey } from 'src/app/utilities/constants';
import { ProjectEditModalComponent } from '../../modals/project-edit-modal/project-edit-modal.component';
import { OnHiddenData, ProjectEditSectionMapperKey } from '../../grant-view.component';

@Component({
    selector: 'app-activities-timeline',
    templateUrl: './activities-timeline.component.html',
    styleUrls: ['./activities-timeline.component.scss'],
})
export class ActivitiesTimelineComponent implements OnInit {
    @Input() project: Project | null = null;
    bsModalRef?: BsModalRef;
    section: ProjectEditSectionMapperKey | null = 'activitiesAndTimeline';
    grantSignalService = inject(GrantSignalService);

    constructor(private modalService: BsModalService, private changeDetection: ChangeDetectorRef) { }

    grantSignalEffect = effect(
        () => {
            const section = this.grantSignalService.editSectionKey() as ProjectEditSectionMapperKey;
            if (section === 'activitiesAndTimeline') {
                this.handleModal();
            }
        },
        {
            allowSignalWrites: true,
        }
    );

    ngOnInit() { }

    getOtherCurrency(otherCurrency: string) {
        return getOtherCurrencyKey(otherCurrency);
    }

    handleModal() {
        this.bsModalRef = this.modalService.show(ProjectEditModalComponent, {
            class: 'modal-lg',
            initialState: {
                project: this.project,
                section: this.section,
            },
        });

        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: OnHiddenData) => {
            if (isSaved) {
                // this.project = data?.project;
                this.changeDetection.detectChanges();
            }
        });
        this.grantSignalService.editSectionKey.set(null);
    }
}
