import { Injectable, signal } from '@angular/core';
import { Application } from '../interfaces/_application.interface';

@Injectable({
    providedIn: 'root',
})
export class ApplicationReviewSignalService {
    public applicationReview = signal<Application | null>(null);
    constructor() { }
}
