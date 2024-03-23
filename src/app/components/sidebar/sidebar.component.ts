import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    menu: any = [
        {
            name: 'dashboard',
            label: 'Dashboard',
            icon: {
                type: 'material',
                name: 'home'
            }
        },
        {
            name: 'grants',
            label: 'Grants',
            icon: {
                type: 'material',
                name: 'business_center'
            }
        },
        {
            name: 'applications',
            label: 'Applications',
            icon: {
                type: 'material',
                name: 'description'
            }
        },
        {
            name: 'partners',
            label: 'Partners',
            icon: {
                type: 'material',
                name: 'foundation'
            }
        },
        {
            name: 'reports',
            label: 'Reports',
            icon: {
                type: 'material',
                name: 'report'
            }
        },
        {
            name: 'settings',
            label: 'Settings',
            icon: {
                type: 'material',
                name: 'settings'
            },
            sub: [
                {
                    name: 'users',
                    label: 'Users',
                    icon: {
                        type: 'material',
                        name: 'groups'
                    }
                },
                {
                    name: 'donors',
                    label: 'Donors',
                    icon: {
                        type: 'fa',
                        name: 'donate'
                    }
                },
                {
                    name: 'roles',
                    label: 'Roles',
                    icon: {
                        type: 'material',
                        name: 'admin_panel_settings'
                    }
                },
                {
                    name: 'links',
                    label: 'Links',
                    icon: {
                        type: 'material',
                        name: 'link'
                    }
                },
            ]
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

    isShow(type: any) {
        if (this.router.url.includes(type)) {
            return 'show';
        }
        return '';
    }
}
