import { HttpClient } from "@angular/common/http";
import { Injectable, Signal, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    public show = signal(false);

    constructor() { }
}