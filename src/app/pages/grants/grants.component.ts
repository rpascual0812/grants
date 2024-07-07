import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DonorService } from 'src/app/services/donor.service';
import { GrantsListComponent } from './grants-list/grants-list.component';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { ToastrService } from 'ngx-toastr';
import { KeySearchQuery, SearchQuery } from './grants-list/modules/fund-release/fund-release.component';

@Component({
    selector: 'app-grants',
    templateUrl: './grants.component.html',
    styleUrls: ['./grants.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GrantsComponent implements OnInit {
    @ViewChild(GrantsListComponent) grantListComponent: GrantsListComponent;

    currentExpandedAccordion = new Set();
    filterSelections = [
        { label: 'Contract Finalization', id: 'contractFinalization', checked: false },
        { label: 'Fund Release', id: 'fundRelease', checked: false },
    ];
    selectedFilterIds = 'contractFinalization';
    donors: Record<string, string>[] = [];
    searchQuery: SearchQuery = {
        partnerName: undefined,
        countryPk: undefined,
        provinceCode: undefined,
        projectTitle: undefined,
        typePk: undefined,
    };

    selectedActiveDonorIds: any = [];
    showFormerDonors: boolean = false;

    constructor(private donorService: DonorService, private cdr: ChangeDetectorRef, private toastr: ToastrService) {}

    ngOnInit() {
        this.fetchDonors();
    }

    fetchDonors() {
        const filters = {
            showInactive: this.showFormerDonors,
        };
        this.donorService.fetch(filters).subscribe({
            next: (res: any) => {
                this.donors = res.data;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Donors. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
            },
        });
    }

    handleCheckedFilterSelect(id: string) {
        this.selectedFilterIds = id;
    }

    handleExpandAccordion($event: boolean, section: string) {
        if ($event) {
            this.currentExpandedAccordion.add(section);
        } else {
            this.currentExpandedAccordion.delete(section);
        }
    }

    handleSelectActiveDonor(pk: string) {
        if (this.selectedActiveDonorIds.includes(pk)) {
            const index = this.selectedActiveDonorIds.indexOf(pk);
            this.selectedActiveDonorIds.splice(index, 1);
        } else {
            this.selectedActiveDonorIds.push(pk);
        }

        this.grantListComponent.setDonors(this.selectedActiveDonorIds);

        this.cdr.detectChanges();
    }

    handleToggleShowInactiveDonors($event: any, showInactiveDonors: boolean) {
        this.showFormerDonors = $event.target.checked;
        this.fetchDonors();
        $event.stopPropagation();
    }

    onChangeSelectedItem(item: Record<'pk' | 'province_code' | 'name', number>[], key: KeySearchQuery) {
        switch (key) {
            case 'provinceCode':
                const provinceVal = item?.at(0)?.province_code;
                this.searchQuery.provinceCode = provinceVal ?? undefined;
                break;
            case 'typePk':
                const typeVal = item?.at(0)?.pk;
                this.searchQuery.typePk = typeVal ?? undefined;
                break;
            case 'countryPk':
                const value = item?.at(0)?.pk;
                this.searchQuery.countryPk = value ?? undefined;
                break;
        }
    }

    handleOnSearch() {
        this.grantListComponent.setSearchQuery(this.searchQuery);
    }
}
