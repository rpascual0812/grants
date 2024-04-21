import { ChangeDetectorRef, Component, Input, OnInit, effect, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Application, Country, Province } from 'src/app/interfaces/_application.interface';
import { Project } from 'src/app/interfaces/_project.interface';
import { GlobalService } from 'src/app/services/global.service';
import { GrantSignalService } from 'src/app/services/grant.signal.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import {
    ProjectEditModalComponent,
    ProjectEditModalTitleMapperKey,
} from '../../modals/project-edit-modal/project-edit-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OnHiddenData } from '../../grant-view.component';

@Component({
    selector: 'app-project-information',
    templateUrl: './project-information.component.html',
    styleUrls: ['./project-information.component.scss'],
})
export class ProjectInformationComponent implements OnInit {
    @Input() project: Project | null = null;
    bsModalRef?: BsModalRef;
    loadingCountryFetch = true;
    loadingProvinceFetch = true;
    section: ProjectEditModalTitleMapperKey | null = 'projectInformation';
    countries: Country[] = [];
    provinces: Province[] = [];

    grantSignalService = inject(GrantSignalService);
    constructor(
        private globalService: GlobalService,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef
    ) { }

    grantSignalEffect = effect(
        () => {
            const section = this.grantSignalService.editSectionKey() as ProjectEditModalTitleMapperKey;
            if (section === 'projectInformation') {
                this.handleModal();
            }
        },
        {
            allowSignalWrites: true,
        }
    );

    ngOnInit() {
        this.fetchCountry();
        this.fetchProvince();
    }

    fetchCountry() {
        this.loadingCountryFetch = true;
        this.globalService.selectFetch(`country`).subscribe({
            next: (res: any) => {
                const data = res?.data as Country[];
                const status = res?.status;
                if (status) {
                    this.countries = data;
                } else {
                    this.toastr.error(`An error occurred while fetching Country. Please try again.`, 'ERROR!');
                }
                this.loadingCountryFetch = false;
            },
            error: (err: any) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Country. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loadingCountryFetch = false;
            },
        });
    }

    fetchProvince() {
        this.loadingProvinceFetch = true;
        this.globalService.selectFetch(`province`).subscribe({
            next: (res: any) => {
                const data = res?.data as Province[];
                const status = res?.status;
                if (status) {
                    this.provinces = data;
                } else {
                    this.toastr.error(`An error occurred while fetching Province. Please try again.`, 'ERROR!');
                }
                this.loadingProvinceFetch = false;
            },
            error: (err: any) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Country. ${statusCode} ${errorMessage} Please try again.`,
                    'ERROR!'
                );
                this.loadingProvinceFetch = false;
            },
        });
    }

    getCountryInfo(countryPk?: number) {
        return this.countries?.find((country) => country?.pk === countryPk);
    }

    getProvinceInfo(provinceCode?: number) {
        return this.provinces?.find((province) => province?.province_code === provinceCode);
    }

    handleModal() {
        this.bsModalRef = this.modalService.show(ProjectEditModalComponent, {
            class: 'modal-lg',
            initialState: {
                project: this.project,
                section: this.section,
                provinces: this.provinces,
                countries: this.countries,
            },
        });

        this.bsModalRef.onHidden?.subscribe(({ data, isSaved }: OnHiddenData) => {
            if (isSaved) {
                this.changeDetection.detectChanges();
            }
        });
        this.grantSignalService.editSectionKey.set(null);
    }
}
