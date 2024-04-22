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
        return this.http.post(`${_.BASE_URL}/users`, user);
    }

    suspend(pk: any, data: any) {
        return this.http.post(`${_.BASE_URL}/accounts/${pk}`, data);
    }

    fetchAll(filters: any) {
        return this.http.get(`${_.BASE_URL}/users`, { params: filters });
    }

    uploadPhoto(object: any) {
        return this.http.post(`${_.BASE_URL}/users/photo`, object);
    }

    sendUserResetPassword(user: any) {
        return this.http.post(`${_.BASE_URL}/users/${user.pk}/reset-password`, { url: window.location.origin });
    }

    resetPassword(account: any) {
        return this.http.post(`${_.BASE_URL}/users/password/update`, account);
    }

    saveRole(role: any, user: any) {
        return this.http.post(`${_.BASE_URL}/users/roles`, { checked: role.checked, role_pk: role.pk, user_pk: user.pk });
    }
}
