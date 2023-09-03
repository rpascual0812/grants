import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class LogService {

    constructor(
        public http: HttpClient,
    ) { }

    fetch(data: any) {
        return this.http.get(`${_.BASE_URL}/logs`, { params: data });
    }
}
