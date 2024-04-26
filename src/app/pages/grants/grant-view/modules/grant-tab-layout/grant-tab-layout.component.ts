import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { FundingReleaseComponent } from '../grant-tab-views/funding-release/funding-release.component';
import { GoalsComponent } from '../grant-tab-views/goals/goals.component';
import { BeneficiariesComponent } from '../grant-tab-views/beneficiaries/beneficiaries.component';
import { AttendeesComponent } from '../grant-tab-views/attendees/attendees.component';
import { OutputsComponent } from '../grant-tab-views/outputs/outputs.component';
import { CapdevComponent } from '../grant-tab-views/capdev/capdev.component';
import { DocumentationsComponent } from '../grant-tab-views/documentations/documentations.component';
import { LessonsComponent } from '../grant-tab-views/lessons/lessons.component';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';

interface Tab {
    title: string;
    content: any;
    active?: boolean;
    customClass?: string;
}

@Component({
    selector: 'app-grant-tab-layout',
    templateUrl: './grant-tab-layout.component.html',
    styleUrls: ['./grant-tab-layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GrantTabLayoutComponent implements OnInit {
    @Input() project: Project | null;

    grantSignalService = inject(GrantSignalService);

    tabs: Tab[] = [
        { title: 'Funding Release', content: FundingReleaseComponent, customClass: 'custom-tab-class', active: true },
        { title: 'Goals', content: GoalsComponent, customClass: 'custom-tab-class', active: false },
        { title: 'Beneficiaries', content: BeneficiariesComponent, customClass: 'custom-tab-class', active: false },
        { title: 'Attendees', content: AttendeesComponent, customClass: 'custom-tab-class', active: false },
        { title: 'Outputs', content: OutputsComponent, customClass: 'custom-tab-class', active: false },
        { title: 'CapDev', content: CapdevComponent, customClass: 'custom-tab-class', active: false },
        { title: 'Documentations', content: DocumentationsComponent, customClass: 'custom-tab-class', active: false },
        { title: 'Lessons', content: LessonsComponent, customClass: 'custom-tab-class', active: false },
    ];

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.grantSignalService.project.set(this.project);
    }
}
