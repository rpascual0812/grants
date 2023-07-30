import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    settings: any = [
        {
            name: 'dashboard',
            label: 'Dashboard',
            icon: 'home'
        },
        {
            name: 'grants',
            label: 'Grants',
            icon: 'business_center'
        },
        {
            name: 'applications',
            label: 'Applications',
            icon: 'description'
        },
        {
            name: 'partners',
            label: 'Partners',
            icon: 'foundation'
        },
        {
            name: 'reports',
            label: 'Reports',
            icon: 'report'
        },
        {
            name: 'users',
            label: 'Users & Roles',
            icon: 'groups'
        },
        {
            name: 'settings',
            label: 'Settings',
            icon: 'settings'
        },
    ];

    constructor(
        private router: Router,
    ) { }

    isActive(type: any) {
        if (this.router.url.includes(type)) {
            return 'active';
        }
        return '';
    }
}
