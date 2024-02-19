import { Component, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

@Component({
    selector: 'app-fiscal-sponsor-information',
    templateUrl: './fiscal-sponsor-information.component.html',
    styleUrls: ['./fiscal-sponsor-information.component.scss'],
})
export class FiscalSponsorInformationComponent {
    applicationSignalService = inject(ApplicationSignalService);

    handleNext() {
        this.applicationSignalService.navigateNext();
    }

    handleBack() {
        this.applicationSignalService.navigateBack();
    }
}
