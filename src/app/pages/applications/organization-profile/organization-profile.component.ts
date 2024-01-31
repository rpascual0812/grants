import { Component } from '@angular/core';
import { COUNTRIES_MOCK } from '../mocks/countries.mock';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss']
})
export class OrganizationProfileComponent {
  kindOfOrgOpts: string[] = [
    `Community/informal`,
    `Local organization/People's organization`,
    `Non-Government organization`,
    `Other organizations`
  ]

  boolOpts = ['Yes', 'No']

  countryOpts: string[] = COUNTRIES_MOCK

  selectedItem: string = ''

  onSelectItem(item: string | string[]) {
    this.selectedItem = item as string
  }
}
