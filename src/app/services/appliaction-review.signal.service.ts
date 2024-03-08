import { Injectable, signal } from '@angular/core';
import { ApplicationRead } from '../interfaces/application.interface';

@Injectable({
    providedIn: 'root',
})
export class ApplicationReviewSignalService {
    public applicationReview = signal<ApplicationRead | null>(null);
    constructor() {}
}
