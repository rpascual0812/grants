import { Component, inject } from '@angular/core';
import { ApplicationSignalService } from 'src/app/services/application.signal.service';

@Component({
    selector: 'app-application-new',
    templateUrl: './application-new.component.html',
    styleUrls: ['./application-new.component.scss'],
})
export class ApplicationNewComponent {
    applicationSignalService = inject(ApplicationSignalService);

    MAX_STEP = 7;
    INITIAL_STEP = 1;
    step = this.INITIAL_STEP;

    onNext() {
        if (this.step < this.MAX_STEP) {
            this.step++;
        }

        this.applicationSignalService.navigateNext.set(true);
    }

    onBack() {
        if (this.step > this.INITIAL_STEP) {
            this.step--;
        }

        this.applicationSignalService.navigateBack.set(true);
    }


}
