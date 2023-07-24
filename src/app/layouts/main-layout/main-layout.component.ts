import { Component, OnInit, Renderer2, RendererFactory2, inject } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
    sidebarService = inject(SidebarService);

    constructor() { }

    ngOnInit() {

    }

}
