import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicLayoutRoutes } from './public-layout.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PublicLayoutRoutes),
    ],
    declarations: [],
})
export class PublicLayoutModule { }
