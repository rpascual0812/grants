import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {

    constructor(
        public http: HttpClient,
    ) { }

    fetchAll() {
        return this.http.get(`${_.BASE_URL}/templates`);
    }

    fetch(data: any) {
        return this.http.get(`${_.BASE_URL}/templates`);
    }

    save(template: any) {
        return this.http.post(`${_.BASE_URL}/templates`, template);
    }
}
