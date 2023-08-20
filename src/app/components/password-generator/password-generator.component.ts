import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'app-password-generator',
    templateUrl: './password-generator.component.html',
    styleUrls: ['./password-generator.component.scss']
})
export class PasswordGeneratorComponent implements OnInit {
    @Output() data = new EventEmitter();

    form: FormGroup;
    letters: any = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    numbers: any = "0123456789";
    ilo: any = "iloIO";
    special: any = "!@#$%^&*()_+~\`|}{[]:;?><,./-=";

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
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.setForm();
    }

    setForm() {
        this.form = this.formBuilder.group({
            password: ['', Validators.required],
        });

        this.generatePassword();
    }

    get f() { return this.form.controls; }

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

        this.form.get('password')?.patchValue(password);

        this.setPassword();
    }

    copyPassword() {
        this.copied = true;
        this.clipboardService.copyFromContent(this.form.value.password);
    }

    setPassword() {
        this.data.emit({ password: this.form.value.password });
    }
}
