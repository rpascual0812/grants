import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
    selector: 'app-application-review',
    templateUrl: './application-review.component.html',
    styleUrls: ['./application-review.component.scss'],
})
export class ApplicationReviewComponent implements OnInit {
    applicationNumber: string = '';

    constructor(
        private route: ActivatedRoute,
        private applicationService: ApplicationService
    ) {
        this.applicationNumber = this.route.snapshot.paramMap.get('number') ?? '';
    }

    ngOnInit(): void {
        this.fetch();
    }

    fetch() {
        this.applicationService.review(this.applicationNumber).subscribe({
            next: (res: any) => {
                console.log(res);
            },
            error: (err: any) => {
                console.log(err);
            },
        });
    }
}
