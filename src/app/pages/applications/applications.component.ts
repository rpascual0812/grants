import { Component } from '@angular/core';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent {
  MAX_STEP = 5;
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
