import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonProfitEquivalencyDeterminationComponent } from './non-profit-equivalency-determination.component';
import { SelectModule } from 'src/app/components/select/select.module';

@NgModule({
    declarations: [NonProfitEquivalencyDeterminationComponent],
    exports: [NonProfitEquivalencyDeterminationComponent],
    imports: [CommonModule, SelectModule],
})
export class NonProfitEquivalencyDeterminationModule {}
