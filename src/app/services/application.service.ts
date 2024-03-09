import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from '../utilities/globals';
@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  public navigate_next = signal(false);
  public navigate_back = signal(false);

  constructor(public http: HttpClient) { }

  fetch(filters?: any) {
    return this.http.get(`${_.BASE_URL}/application`, { params: filters });
  }

  fetchOne(pk: any) {
    return this.http.get(`${_.BASE_URL}/application/${pk}`);
  }

  review(number: any) {
    return this.http.get(`${_.BASE_URL}/application/${number}/review`);
  }

  generate(data: any) {
    return this.http.post(`${_.BASE_URL}/application/generate`, data);
  }

  store(data: any) {
    return this.http.post(`${_.BASE_URL}/application`, data);
  }

  destroy(pk: any) {
    return this.http.delete(`${_.BASE_URL}/application/${pk}`);
  }
}
