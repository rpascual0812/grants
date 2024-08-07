import { Component, OnInit, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';
import { UserSignalService } from 'src/app/services/user.signal.service';
import * as _ from '../../utilities/globals';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    user: any;
    api: String = _.BASE_URL;
    url: string = '';

    sidebarService = inject(SidebarService);
    userSignalService = inject(UserSignalService);

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private authService: AuthService,
        private userService: UserService
    ) {

    }

    ngOnInit(): void {
        this.fetch();
        this.url = window.location.origin;
    }

    fetch() {
        this.userService
            .fetch()
            .subscribe({
                next: (data: any) => {
                    this.user = data;
                    this.userSignalService.user.set(data);
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    // console.log('Complete');
                }
            });
    }

    toggle() {
        this.sidebarService.show.set(!this.sidebarService.show());
    }

    logout() {
        this.authService.logout()
            .subscribe({
                next: (data: any) => {
                    this.authService.unsetSession();
                    this.router.navigateByUrl('/auth');
                },
                error: (error: any) => {
                    this.toastr.error('An error occurred while fetching your account. Please try again', 'ERROR!');
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }
}
