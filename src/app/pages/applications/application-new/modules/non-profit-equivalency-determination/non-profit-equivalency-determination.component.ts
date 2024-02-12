import { Component } from '@angular/core';
import { CURRENCIES_MOCK } from '../../../mocks/currencies.mock';

@Component({
  selector: 'app-non-profit-equivalency-determination',
  templateUrl: './non-profit-equivalency-determination.component.html',
  styleUrls: ['./non-profit-equivalency-determination.component.scss']
})
export class NonProfitEquivalencyDeterminationComponent {
  availableCurrencies = CURRENCIES_MOCK;
}
