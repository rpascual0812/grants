import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grants',
  templateUrl: './grants.component.html',
  styleUrls: ['./grants.component.scss']
})
export class GrantsComponent implements OnInit {
  currentExpandedAccordion = new Set();
  filterSelections = [
    { label: 'Grant Application', id: 'grantApplication', checked: true },
    { label: 'Contract Finalization', id: 'contractFinalization', checked: false },
    { label: 'Fund Release', id: 'fundRelease', checked: false },
  ];
  selectedFilterIds: Set<string> = new Set();
  activeDonors: Record<string, string>[] = [];
  selectedActiveDonorId = '';


  ngOnInit() {
    this.selectedFilterIds.add('grantApplication')
  }

  handleCheckedFilterSelect(checked: boolean, id: string) {
    this.filterSelections = this.filterSelections.map((selection) => ({
      ...selection,
      checked: id === selection.id && checked ? true : false,
    }));
    if (checked) {
      this.selectedFilterIds.add(id);
    } else {
      this.selectedFilterIds.delete(id);
    }
  }

  handleExpandAccordion($event: boolean, section: string) {
    if ($event) {
      this.currentExpandedAccordion.add(section);
    } else {
      this.currentExpandedAccordion.delete(section);
    }
  }

  handleSelectActiveDonor(id: string) {
    this.selectedActiveDonorId = id;
  }

  handleToggleShowInactiveDonors($event: Event, showInactiveDonors: boolean) {
    $event.stopPropagation();
  }

}
