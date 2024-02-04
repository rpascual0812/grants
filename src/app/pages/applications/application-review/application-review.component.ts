import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-application-review',
    templateUrl: './application-review.component.html',
    styleUrls: ['./application-review.component.scss']
})
export class ApplicationReviewComponent implements OnInit {
    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        const pk = this.route.snapshot.paramMap.get('pk');

        console.log(pk);
    }
}
