import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Type } from 'src/app/interfaces/_application.interface';
import { GlobalService } from 'src/app/services/global.service';
import { ProjectService } from 'src/app/services/project.service';
import { extractErrorMessage } from 'src/app/utilities/application.utils';
import { TOTAL_GRANT_PER_FUNCTION, TotalGrantPerFunctionKey } from 'src/app/utilities/constants';

interface GroupedType {
    [key: string]: Type;
}

interface GroupProjectType {
    type_pk: number;
    total: string;
}

@Component({
    selector: 'app-total-grant-function',
    templateUrl: './total-grant-function.component.html',
    styleUrls: ['./total-grant-function.component.scss'],
})
export class TotalGrantFunctionComponent implements OnInit {
    loading = {
        types: true,
        groupProjectType: true,
    };
    types: Type[] = [];
    groupProjectType: GroupProjectType[] = [];

    constructor(
        private projectService: ProjectService,
        private globalService: GlobalService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.fetchProjectType();
        this.fetchGroupProjectType();
    }

    get groupedProjectType() {
        const groupedTypes = this.types.reduce((acc, obj) => {
            const key = obj?.pk ?? '';
            acc[key] = obj;
            return acc;
        }, {} as GroupedType);

        const mappedObject = Object.keys(groupedTypes).map((key) => {
            const name = groupedTypes[key].name;
            const value = this.groupProjectType.find((item) => item.type_pk === groupedTypes[key].pk);
            return {
                pk: key,
                name,
                total: Number(value?.total ?? '') ?? 0,
            };
        });

        const tempGroupedProjType = Object.keys(TOTAL_GRANT_PER_FUNCTION).map((key) => {
            const item = TOTAL_GRANT_PER_FUNCTION[key as TotalGrantPerFunctionKey];
            const computedTotal = item.associatedKey.reduce((acc, key) => {
                const typeTotal = mappedObject.find((item) => item.name === key)?.total ?? 0;
                acc = acc + (typeTotal as number);
                return acc;
            }, 0);

            return {
                name: key,
                total: computedTotal,
                imagePath: item.imagePath,
                color: item.color
            };
        });

        return tempGroupedProjType;
    }

    fetchProjectType() {
        this.loading.types = true;
        this.globalService.selectFetch(`types`).subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data;
                if (status) {
                    this.types = data;
                } else {
                    this.toastr.error('An error occurred while fetching Project Types. Please try again', 'ERROR!');
                }
                this.loading.types = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Project Types. ${statusCode}  ${errorMessage} Please try again`,
                    'ERROR!'
                );
                this.loading.types = false;
            },
        });
    }

    fetchGroupProjectType() {
        this.loading.groupProjectType = true;
        this.projectService.fetchGroupProjectType().subscribe({
            next: (res: any) => {
                const status = res?.status;
                const data = res?.data;
                if (status) {
                    this.groupProjectType = data;
                } else {
                    this.toastr.error(
                        'An error occurred while fetching Group Project Types. Please try again',
                        'ERROR!'
                    );
                }
                this.loading.groupProjectType = false;
            },
            error: (err) => {
                const { statusCode, errorMessage } = extractErrorMessage(err);
                this.toastr.error(
                    `An error occurred while fetching Group Project Types. ${statusCode}  ${errorMessage} Please try again`,
                    'ERROR!'
                );
                this.loading.groupProjectType = false;
            },
        });
    }
}
