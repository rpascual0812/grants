import { Component } from '@angular/core';

interface Evaluation {
    [key: string]: string;
}

@Component({
    selector: 'app-evaluations',
    templateUrl: './evaluations.component.html',
    styleUrls: ['./evaluations.component.scss'],
})
export class EvaluationsComponent {
    evaluations: Evaluation[] = [
        {
            id: new Date().getTime().toString(),
            date: 'July 5, 2022',
            user: 'Jane Doe',
            content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque enim illum eligendi voluptatibus impedit
  dolore ipsa quidem officia ab, assumenda neque, earum necessitatibus sequi pariatur dolorum ullam eius
  ad. Consequatur!`,
        },
    ];

    handleAddEvaluation() {
        this.evaluations.push({
            id: new Date().getTime().toString(),
            date: 'July 5, 2022',
            user: 'Jane Doe',
            content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque enim illum eligendi voluptatibus impedit
      dolore ipsa quidem officia ab, assumenda neque, earum necessitatibus sequi pariatur dolorum ullam eius
      ad. Consequatur!`,
        });
    }

    handleDeleteEvaluation(id: string) {
        this.evaluations = this.evaluations.filter((evaluation) => evaluation?.['id'] !== id);
    }
}
