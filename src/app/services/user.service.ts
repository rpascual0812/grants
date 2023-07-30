import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        public http: HttpClient,
    ) { }

    fetch() {
        return this.http.get(`${_.BASE_URL}/users/profile`);
    }

    save(user: any) {
        return this.http.post(`${_.BASE_URL}/users/update`, user);
    }

    fetchAll(filters: any) {
        return this.http.get(`${_.BASE_URL}/users`, { params: filters });
    }

    uploadPhoto(object: any) {
        return this.http.post(`${_.BASE_URL}/users/photo`, object);
    }
}
