import { Component, inject } from '@angular/core';
import { CURRENCIES_MOCK } from '../../../mocks/currencies.mock';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

@Component({
    selector: 'app-non-profit-equivalency-determination',
    templateUrl: './non-profit-equivalency-determination.component.html',
    styleUrls: ['./non-profit-equivalency-determination.component.scss'],
})
export class NonProfitEquivalencyDeterminationComponent {
    availableCurrencies = CURRENCIES_MOCK;
    applicationSignalService = inject(ApplicationSignalService);

    handleNext() {
        this.applicationSignalService.navigateNext();
    }

    handleBack() {
        this.applicationSignalService.navigateBack();
    }
}
