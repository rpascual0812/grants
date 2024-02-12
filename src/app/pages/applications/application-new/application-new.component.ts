import { Component } from '@angular/core';

@Component({
    selector: 'app-application-new',
    templateUrl: './application-new.component.html',
    styleUrls: ['./application-new.component.scss'],
})
export class ApplicationNewComponent {
    MAX_STEP = 7;
    INITIAL_STEP = 1;
    step = this.INITIAL_STEP;

    onNext() {
        if (this.step < this.MAX_STEP) {
            this.step++;
        }
    }

    onBack() {
        if (this.step > this.INITIAL_STEP) {
            this.step--;
        }
    }
}
