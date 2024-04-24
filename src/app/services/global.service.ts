import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    constructor(
        public http: HttpClient
    ) { }

    selectFetch(data: any) {
        return this.http.get(`${_.BASE_URL}/${data}`);
    }
}
