import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';

@Component({
    selector: 'app-total-per-donor',
    templateUrl: './total-per-donor.component.html',
    styleUrls: ['./total-per-donor.component.scss']
})
export class TotalPerDonorComponent implements OnInit {
    loading: boolean = false;
    currentDonor: any = [];
    formerDonor: any = [];

    constructor(
        private projectService: ProjectService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.fetch();
    }

    fetch() {
        this.projectService.fetchTotalPerDonor().subscribe({
            next: (data: any) => {
                let donors_obj: any = [];

                data.forEach((datum: any) => {
                    datum.project_funding.forEach((funding: any) => {
                        if (!donors_obj[funding.donor.name]) {
                            donors_obj[funding.donor.name] = {
                                pk: funding.donor.pk,
                                name: funding.donor.name,
                                active: funding.donor.active,
                                count: 0
                            }
                        }

                        donors_obj[funding.donor.name].count++;
                    });

                });

                const donor_keys = Object.keys(donors_obj);
                let donors: any = [];
                donor_keys.forEach((key: string) => {
                    donors.push(donors_obj[key]);
                });

                var sortable = donors.slice(0);
                sortable.sort((a: any, b: any) => {
                    var x = a.name.toLowerCase();
                    var y = b.name.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });

                console.log(sortable);

                this.currentDonor = sortable.filter((donor: any) => donor.active);
                this.formerDonor = sortable.filter((donor: any) => !donor.active);
            },
            error: (error: any) => {
                console.log(error);
            },
            complete: () => {
                console.log('Complete');
            },
        });
    }
}
