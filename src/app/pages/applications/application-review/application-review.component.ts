import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-application-review',
    templateUrl: './application-review.component.html',
    styleUrls: ['./application-review.component.scss'],
})
export class ApplicationReviewComponent implements OnInit {
    pk: string = '';

    constructor(private route: ActivatedRoute) {
        this.pk = this.route.snapshot.paramMap.get('pk') ?? '';
    }

    ngOnInit(): void {
        console.log(this.pk);
    }
}
