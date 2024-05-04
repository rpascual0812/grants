import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/_application.interface';

@Injectable({
    providedIn: 'root',
})
export class UserSignalService {
    public user = signal<User | null>(null);

    constructor() { }
}
