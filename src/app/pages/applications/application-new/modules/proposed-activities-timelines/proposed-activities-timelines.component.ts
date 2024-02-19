import { Component, inject } from '@angular/core';
import { CURRENCIES_MOCK } from '../../../mocks/currencies.mock';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

interface ProposedActivity {
    id: number;
    activityName: string;
    duration: string;
}

@Component({
    selector: 'app-proposed-activities-timelines',
    templateUrl: './proposed-activities-timelines.component.html',
    styleUrls: ['./proposed-activities-timelines.component.scss'],
})
export class ProposedActivitiesTimelinesComponent {
    proposedActivities: ProposedActivity[] = [];
    availableCurrencies = CURRENCIES_MOCK;
    applicationSignalService = inject(ApplicationSignalService);

    onAddActivity() {
        this.proposedActivities = [
            ...this.proposedActivities,
            {
                id: new Date().getTime(),
                activityName: '',
                duration: '',
            },
        ];
    }

    onRemoveActivity(id: number) {
        this.proposedActivities = this.proposedActivities.filter((activity) => activity.id !== id);
    }

    handleNext() {
        this.applicationSignalService.navigateNext();
    }

    handleBack() {
        this.applicationSignalService.navigateBack();
    }
}
