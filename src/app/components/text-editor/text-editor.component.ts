import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import * as _ from '../../utilities/globals';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';

declare var tinymce: any;

@Component({
    selector: 'app-text-editor',
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent {
    @Input() conditions: any = {
        showUploader: false
    };

    @Input() content: any = '';
    @Input() height: any = 500;

    @Input() variables: any = [];

    tinymceInit: any;
    source: any;
    documentModalRef?: BsModalRef;
    editor: any;

    options: any = {};

    constructor(
        private modalService: BsModalService,
    ) { }

    ngOnInit(): void {
        this.options = {
            height: this.height,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
                'code undo redo | formatselect | bold italic forecolor backcolor |' +
                'alignleft aligncenter alignright alignjustify | ' +
                'table lists bullist numlist outdent indent charmap | link ' + (this.conditions.showUploader ? 'fileuploader' : '') + ' ' + (this.variables && this.variables.length > 0 ? 'variables' : '') + ' | removeformat | fullscreen ' + ' help',
            setup: (editor: any) => {
                this.editor = editor;
                const buttonAction = () => {
                    this.openDocuments();
                }

                editor.ui.registry.addButton('fileuploader', {
                    icon: 'gallery',
                    tooltip: "Insert image from documents",
                    onAction: () => {
                        buttonAction();
                    }
                });

                editor.ui.registry.addMenuButton('variables', {
                    icon: 'code-sample',
                    fetch: (callback: any) => {
                        let items: any = [];
                        this.variables.forEach((v: any) => {
                            items.push({
                                type: 'menuitem',
                                text: v,
                                onAction: () => {
                                    editor.insertContent('&nbsp;{' + v + '}');
                                }
                            });
                        });

                        callback(items);
                    }
                });
            }
        };
    }

    ngAfterViewInit(): void {
        tinymce.init(this.options);
    }

    openDocuments() {
        const initialState: ModalOptions = {
            class: 'modal-xl',
            initialState: {}
        };

        this.documentModalRef = this.modalService.show(FileUploaderComponent, initialState);

        this.documentModalRef.content.document.subscribe((res: any) => {
            if (res.file) {
                this.editor.insertContent('<img src="' + (_.BASE_URL + '/' + res.file.path) + '"/>');
            }
        });
    }

    returnMessage() {
        return this.editor.getContent();
    }

    reset() {
        this.editor.setContent('');
    }
}
