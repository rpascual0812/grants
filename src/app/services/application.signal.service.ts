import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ApplicationSignalService {
    public navigateNext = signal(false);
    public navigateBack = signal(false);

    constructor() { }
}