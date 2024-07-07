import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataCollectionComponent } from './data-collection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        DataCollectionComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule
    ],
    exports: [DataCollectionComponent]
})
export class DataCollectionModule { }
