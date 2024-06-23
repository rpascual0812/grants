import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantClosingComponent } from './grant-closing.component';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        GrantClosingComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [GrantClosingComponent]
})
export class GrantClosingModule { }
