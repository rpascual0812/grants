import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrantsComponent } from './grants.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrantsListModule } from './grants-list/grants-list.module';
import { BaseChartDirective } from 'ng2-charts';
import { SummaryModule } from './grants-list/modules/summary/summary.module';


@NgModule({
  declarations: [
    GrantsComponent
  ],
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    GrantsListModule,
    BaseChartDirective,
    SummaryModule,
  ]
})
export class GrantsModule { }
