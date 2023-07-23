import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        public http: HttpClient,
        private router: Router
    ) { }

    login(data: any) {
        return this.http.post(`${_.BASE_URL}/login`, data);
    }

    isLoggedIn() {
        return !!localStorage.getItem('o__token');
    }

    setSession(res: any) {
        this.unsetSession();
        localStorage.setItem('o__token', res.user.access_token);
    }

    unsetSession() {
        this.logout();
        localStorage.removeItem("o__token");
    }

    logout() {
        const url = `${_.BASE_URL}/logout`;
        return this.http.post(url, { token: localStorage.getItem('o__token') });
    }

    forgot(data: any) {
        return this.http.post(`${_.BASE_URL}/forgot-password`, data);
    }

    reset(data: any) {
        return this.http.post(`${_.BASE_URL}/reset-password`, data);
    }

    resetToken(token: string) {
        return this.http.get(`${_.BASE_URL}/reset-token`, { params: { token } });
    }
}
