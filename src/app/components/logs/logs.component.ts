import { Component, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss']
})
export class LogsComponent {
    public callback: EventEmitter<any> = new EventEmitter();
}
