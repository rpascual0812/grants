import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
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
        showUploader: false,
        showSendPreview: false
    };

    @Input() id: any = '';
    @Input() content: any = '';
    @Input() height: any = 500;

    @Input() variables: any = [];

    @Output() openSendPreview = new EventEmitter<string>();

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
                'custom_send_email advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
                'code ' + (this.conditions.showSendPreview ? 'custom_send_email' : '') + ' undo redo | formatselect | bold italic forecolor backcolor |' +
                'alignleft aligncenter alignright alignjustify | ' +
                'table lists bullist numlist outdent indent charmap | link ' + (this.conditions.showUploader ? 'fileuploader' : '') + ' ' + (this.variables && this.variables.length > 0 ? 'variables' : '') + ' | removeformat | fullscreen ' + ' help',
            setup: (editor: any) => {
                this.editor = editor;
                const showFileUploader = () => {
                    this.openDocuments();
                }
                const sendPreview = () => {
                    this.openSendPreviewModal();
                }

                editor.ui.registry.addIcon('send', '<svg fill="#000000" height="24" width="24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495.003 495.003" xml:space="preserve"><g id="XMLID_51_"><path id="XMLID_53_" d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616l-67.6-32.22V456.687z"/><path id="XMLID_52_" d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z"/></g></svg>');

                editor.ui.registry.addButton('custom_send_email', {
                    icon: 'send',
                    tooltip: "Send Email",
                    onAction: () => {
                        sendPreview();
                    }
                });

                editor.ui.registry.addButton('fileuploader', {
                    icon: 'gallery',
                    tooltip: "Insert image from documents",
                    onAction: () => {
                        showFileUploader();
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

    set(content: string) {
        this.editor.setContent(content);
    }

    openSendPreviewModal() {
        this.openSendPreview.emit(this.id);
    }
}
