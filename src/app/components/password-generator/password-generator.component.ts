import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'app-password-generator',
    templateUrl: './password-generator.component.html',
    styleUrls: ['./password-generator.component.scss']
})
export class PasswordGeneratorComponent implements OnInit {
    letters: any = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    numbers: any = "0123456789";
    ilo: any = "iloIO";
    special: any = "!@#$%^&*()_+~\`|}{[]:;?><,./-=";

    password: any = '';
    range: any = 6;
    checkboxes: any = {
        letters: true,
        numbers: true,
        ilo: true,
        special: true
    }
    copied: boolean = false;

    constructor(
        private clipboardService: ClipboardService,
    ) { }

    ngOnInit(): void {
        this.generatePassword();
    }

    generatePassword() {
        this.copied = false;
        var chars = "";

        Object.keys(this.checkboxes).forEach((checkbox: any) => {
            switch (checkbox) {
                case 'letters':
                    if (this.checkboxes[checkbox]) {
                        chars += this.letters;
                    }
                    break;
                case 'numbers':
                    if (this.checkboxes[checkbox]) {
                        chars += this.numbers;
                    }
                    break;
                case 'ilo':
                    if (this.checkboxes[checkbox]) {
                        chars += this.ilo;
                    }
                    break;
                case 'special':
                    if (this.checkboxes[checkbox]) {
                        chars += this.special;
                    }
                    break;

                default:
                    break;
            }
        });

        var passwordLength = this.range;
        var password = "";

        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber + 1);
        }

        this.password = password;
    }

    copyPassword() {
        this.copied = true;
        this.clipboardService.copyFromContent(this.password);
    }
}
