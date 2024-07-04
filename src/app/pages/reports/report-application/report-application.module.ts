import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportApplicationComponent } from './report-application.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'src/app/components/select/select.module';
import { BaseChartDirective } from 'ng2-charts';
import { TotalApplicationComponent } from './total-application/total-application.component';
import { ApplicationStatusesComponent } from './application-statuses/application-statuses.component';
import { ApplicationBudgetComponent } from './application-budget/application-budget.component';


@NgModule({
    declarations: [
        ReportApplicationComponent,
        TotalApplicationComponent,
        ApplicationStatusesComponent,
        ApplicationBudgetComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        BaseChartDirective
    ],
    exports: [ReportApplicationComponent]
})
export class ReportApplicationModule { }
