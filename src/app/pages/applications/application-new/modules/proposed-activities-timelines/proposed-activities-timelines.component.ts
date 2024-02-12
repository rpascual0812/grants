import { Component } from '@angular/core';
import { CURRENCIES_MOCK } from '../../../mocks/currencies.mock';

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
}
