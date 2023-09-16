import { Component } from '@angular/core';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class InputComponent {
    onFocus(element: any) {
        element.parentNode.classList.add("is-focused");
    }

    onExit(element: any) {
        element.parentNode.classList.remove("is-focused");
    }
}
