import { Component, inject } from '@angular/core';
import { UserService } from './services/user.service';
import { UserSignalService } from './services/user.signal.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    user: any;

    userSignalService = inject(UserSignalService);

    constructor(
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.fetch();
    }

    fetch() {
        this.userService
            .fetch()
            .subscribe({
                next: (data: any) => {
                    this.userSignalService.user.set(data);
                },
                error: (error: any) => {
                    console.log(error);
                },
                complete: () => {
                    console.log('Complete');
                }
            });
    }
}
