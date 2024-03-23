import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LinksComponent } from './links.component';
import { LinkGeneratorModule } from 'src/app/components/link-generator/link-generator.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NewLinkModalComponent } from './new-link-modal/new-link-modal.component';


@NgModule({
    declarations: [
        LinksComponent,
        NewLinkModalComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        LinkGeneratorModule,
        NgxPaginationModule
    ]
})
export class LinksModule { }
