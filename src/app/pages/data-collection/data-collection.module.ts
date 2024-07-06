import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataCollectionComponent } from './data-collection.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'src/app/components/select/select.module';


@NgModule({
    declarations: [
        DataCollectionComponent
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [DataCollectionComponent]
})
export class DataCollectionModule { }
