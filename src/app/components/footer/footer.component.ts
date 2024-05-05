import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    year: any;
    theme: any;

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.theme = this.router.url.includes("auth") ? 'auth' : 'other';
        this.year = DateTime.now().year;
    }
}
