import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

import * as _ from '../../utilities/globals';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    menu: any = 'profile';
    activeMenuPosition: any = 'translate3d(0px, 0px, 0px)';
    activeWidth: any = 115;

    url: String = _.BASE_URL;
    loading: boolean = false;
    user: any = {};

    constructor(
        private userService: UserService,
    ) {

    }

    ngOnInit(): void {
        this.fetch();
    }

    setActiveMenu(title: any) {
        this.menu = title;
    }

    fetch() {
        this.userService
            .fetch()
            .subscribe({
                next: (data: any) => {
                    console.log(data);
                    this.user = data;
                },
                error: (error: any) => {
                    console.log(error);
                    setTimeout(() => { this.loading = false; }, 500);
                },
                complete: () => {
                    console.log('Complete');
                    setTimeout(() => { this.loading = false; }, 500);
                }
            });
    }
}
