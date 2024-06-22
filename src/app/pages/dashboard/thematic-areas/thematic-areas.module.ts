import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThematicAreasComponent } from './thematic-areas.component';



@NgModule({
    declarations: [
        ThematicAreasComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [ThematicAreasComponent]
})
export class ThematicAreasModule { }
