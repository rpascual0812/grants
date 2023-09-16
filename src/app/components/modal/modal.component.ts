import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
    form: FormGroup;

    constructor() { }
    @Input() title: string = '';
    @Input() body: string = '';
    @Output() closeMeEvent = new EventEmitter();
    @Output() confirmEvent = new EventEmitter();
    ngOnInit(): void {
        console.log('Modal init');
    }

    closeMe() {
        this.closeMeEvent.emit();
    }
    confirm() {
        this.confirmEvent.emit();
    }
    ngOnDestroy(): void {
        console.log(' Modal destroyed');
    }

    onEnter(element: any) {
        console.log('enter', element, element.value);
        element.parentNode.querySelector("label").classList.add("active");

        // if ((element.value !== undefined && element.value.length >= 0) || $(this).attr('placeholder') !== null) {
        //     element.parentNode.querySelector("label").classList.add("active");
        // }
    }

    onExit(element: any) {
        console.log('exit', element);
        // if ((element.value !== undefined && element.value.length == 0) || $(this).attr('placeholder') === null) {
        //     element.parentNode.querySelector("label").classList.remove("active");
        // }
    }
}

