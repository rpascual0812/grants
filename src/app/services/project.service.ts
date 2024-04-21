import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    constructor(public http: HttpClient) { }

    fetch(pk: any) {
        return this.http.get(`${_.BASE_URL}/projects`);
    }

    fetchOne(pk: any) {
        return this.http.get(`${_.BASE_URL}/projects/${pk}/review`);
    }
}
