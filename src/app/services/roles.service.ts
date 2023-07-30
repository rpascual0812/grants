import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(
        public http: HttpClient,
    ) { }

    fetchAll(filters: any) {
        return this.http.get(`${_.BASE_URL}/roles`, { params: filters });
    }

    save(role: any, user: any) {
        return this.http.post(`${_.BASE_URL}/roles`, { checked: role.checked, role_pk: role.pk, user_pk: user.pk });
    }
}
