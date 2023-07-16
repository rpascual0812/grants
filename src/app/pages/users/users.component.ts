import { Component } from '@angular/core';
import * as _ from '../../utilities/globals';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent {
    addNewModal() {
        _.errorMessage("This is a test error alert");
        _.successMessage("This is a test success alert");
    }
}
