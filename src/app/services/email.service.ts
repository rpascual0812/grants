import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    constructor(
        public http: HttpClient,
    ) { }

    save(data: any) {
        return this.http.post(`${_.BASE_URL}/emails`, data);
    }
}
