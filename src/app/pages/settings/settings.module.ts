import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutes } from './settings.routing';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SettingsRoutes),
    ],
    declarations: [

    ],
})
export class SettingsModule { }
