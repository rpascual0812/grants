import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem('o__token');
        if (token) {
            request = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

            return next.handle(request);
        }
        else {
            return next.handle(request);
        }
    }
}
