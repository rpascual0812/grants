import { Component, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { NewApplicationModalComponent } from './applications-list/modules/new-application-modal/new-application-modal.component';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ApplicationsComponent {
  bsModalRef?: BsModalRef;
  currentExpandedAccordion = new Set();
  filterSelections = [
    { label: 'Grant Application', id: 'grantApplication', checked: true },
    { label: 'Contract Finalization', id: 'contractFinalization', checked: false },
    { label: 'Fund Release', id: 'fundRelease', checked: false },
  ];
  selectedFilterIds: Set<string> = new Set();
  activeDonors: Record<string, string>[] = [];
  selectedActiveDonorId = '';

  constructor(
    private modalService: BsModalService
  ) {
    // mock active donors
    this.init();
  }

  init() {
    for (let i = 1; i <= 6; i++) {
      this.activeDonors.push({
        id: `${i}`,
        code: `${i}`,
        label: `Global Greengrants Fund/GGF ${i}`,
      });
    }
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

  showActiveDonorSelection() {
    return this.selectedFilterIds.has('grantApplication') || this.selectedFilterIds.has('fundRelease');
  }

  apply() {
    const initialState: ModalOptions = {
      class: 'modal-xl',
      initialState: {
        title: 'New Application',
      }
    };
    this.bsModalRef = this.modalService.show(NewApplicationModalComponent, initialState);
    this.bsModalRef.content.saveBtnName = 'Send';
    this.bsModalRef.content.closeBtnName = 'Cancel';
    this.bsModalRef.content.activateBtnName = 'Activate';

    this.bsModalRef.content.callback.subscribe((res: any) => {
      console.log("🚀 ~ ApplicationsComponent ~ this.bsModalRef.content.callback.subscribe ~ res:", res);
      const data = res.data.data;
      console.log("🚀 ~ ApplicationsComponent ~ this.bsModalRef.content.callback.subscribe ~ data:", data);
      this.init();
      // this.users.forEach(user => {
      //     if (user.pk == data.pk) {
      //         user.first_name = data.first_name;
      //         user.last_name = data.last_name;
      //         user.last_name = data.last_name;
      //     }
      // });
    });
  }
}
