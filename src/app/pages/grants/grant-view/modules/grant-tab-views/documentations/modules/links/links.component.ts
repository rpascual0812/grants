import { Component, OnInit, inject } from '@angular/core';
import * as _ from '../../../../../../../../utilities/globals';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/interfaces/_project.interface';
import { GrantSignalService } from 'src/app/services/grant.signal.service';

@Component({
    selector: 'app-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.scss']
})
export class LinksComponent {

    show: boolean = false;
    links: any = [];
    url: String = _.BASE_URL;

    selected: any = [];
    filters: any = {};

    pagination: any = _.PAGINATION;
    tableSizes: any = _.TABLE_SIZES;

    link: string = '';

    project: Project | null = null;
    grantSignalService = inject(GrantSignalService);

    constructor(
        private projectService: ProjectService,
    ) {

    }

    ngOnInit(): void {
        this.project = this.grantSignalService.project();

        this.filters = {
            project_pk: this.project?.pk as number,
            keyword: '',
            archived: false,
            skip: 0,
            take: this.pagination.tableSize
        };

        this.fetch();
    }

    fetch() {
        this.filters.skip = (this.pagination.page * this.pagination.tableSize) - this.pagination.tableSize;
        this.filters.take = this.pagination.tableSize;

        this.projectService
            .fetchProjectLinks(this.filters)
            .subscribe({
                next: (data: any) => {
                    this.links = data.data;

                    this.pagination.count = data.total;
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }

    save() {
        if (this.link.replace(/\s/g, '') !== '') {
            this.projectService.saveProjectLink({ project_pk: this.project?.pk, link: this.link }).subscribe({
                next: (res: any) => {
                    this.link = '';
                    // const link = res.data;
                    // this.links.unshift(link);
                    this.fetch();
                },
                error: (err: any) => {

                },
            });
        }
    }

    delete(i: number) {
        _.confirmMessage(
            {
                title: '<strong>Are you sure you want to delete this link?</strong>',
                icon: 'question',
                buttons: {
                    showClose: true,
                    showCancel: true,
                    focusConfirm: false,
                },
                confirmButtonText: '<i class="fa fa-trash"></i> Delete',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> No, cancel',
            },
            () => {
                this.projectService
                    .destroyProjectLinks(this.links[i].pk)
                    .subscribe({
                        next: (data: any) => {
                            this.links.splice(i, 1);
                        },
                        error: (error: any) => {
                            console.log(error);
                        },
                        complete: () => {
                            console.log('Complete');
                        }
                    });
            }
        );

    }

    onTableDataChange(event: any) {
        this.pagination.page = event;
        this.fetch();
    }

    onTableSizeChange(event: any): void {
        this.pagination.tableSize = event.target.value;
        this.pagination.page = 1;
        this.fetch();
    }
}
