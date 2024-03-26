import { ApplicationListSignalService } from './../../services/application-list.signal.service';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { GRANT_TYPES } from 'src/app/utilities/constants';

type SelectItem = {
    pk: number;
    name: string;
};

@Component({
    selector: 'app-applications',
    templateUrl: './applications.component.html',
    styleUrls: ['./applications.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ApplicationsComponent {
    grantTypes = GRANT_TYPES;
    selectiveIndicator = [];
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

    appListSignalService = inject(ApplicationListSignalService);
    constructor(private modalService: BsModalService) {
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
        this.selectedFilterIds.add('grantApplication');
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
        this.init();
        this.appListSignalService.applyFilter.set(true)
    }

    onChangeSelectedItem(item: SelectItem[] | string[], key: string) {
        const extractedItem = item?.at(0);
        const pk = (extractedItem as SelectItem)?.pk ?? '';
        const currentFilters = this.appListSignalService.filters()
        this.appListSignalService.filters.set({
            ...currentFilters,
            [key]: pk,
        });
    }
}
