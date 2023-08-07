import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class GenderService {

    constructor(
        public http: HttpClient,
    ) { }

    fetchAll(pagination: any) {
        return this.http.get(`${_.BASE_URL}/genders`, { params: pagination });
    }

    fetch(data: any) {
        return this.http.get(`${_.BASE_URL}/genders`);
    }
}
