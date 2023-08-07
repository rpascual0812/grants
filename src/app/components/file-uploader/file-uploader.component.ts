import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as _ from '../../utilities/globals';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FileUploadService } from 'src/app/services/fileupload.service';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
    public document: EventEmitter<any> = new EventEmitter();

    submitted: boolean = false;
    selectedFiles: any = [];
    currentFile?: File;
    processed: number = 0;
    notProcessed: number = 0;
    progress: number = 0;
    uploaded: number = 0;
    files: any = [];
    errors: any = [];


    constructor(
        private cdr: ChangeDetectorRef,
        public fileUploaderRef: BsModalRef,
        public fileUploadService: FileUploadService,
    ) {

    }
    ngOnInit() {

    }

    reset() {
        this.selectedFiles = [];
        this.processed = 0;
        this.notProcessed = 0;
        this.progress = 0;
        this.uploaded = 0;
        this.files = [];
        this.errors = [];
        this.submitted = false;
    }

    selectFiles(event: any): void {
        this.reset();

        this.selectedFiles = event.target.files;
        for (let i = 0; i < this.selectedFiles.length; i++) {
            this.files.push({ name: this.selectedFiles[i].name, status: 'Pending' });
        }

        this.cdr.detectChanges();
    }

    uploadFiles(): void {
        for (let i = 0; i < this.selectedFiles.length; i++) {
            this.upload(i, this.selectedFiles[i]);
        }
    }

    upload(i: any, file: File) {
        this.submitted = true;
        this.processed++;
        this.fileUploadService.upload(file)
            .subscribe({
                next: (event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(100 * event.loaded / event.total);
                    } else if (event instanceof HttpResponse) {
                        this.document.emit({ file: event.body });
                    }
                },
                error: (err: any) => {
                    console.log(err);
                    this.progress = 0;

                    if (err.error && err.error.message) {
                        console.log(err.error.message);
                    } else {
                        console.log('Could not upload the file!');
                    }
                }
            });
    }

    // upload(i: any, file: any) {
    //     this.submitted = true;
    //     this.processed++;
    //     this.fileUploadService.upload(file)
    //         .then((data: any) => {
    //             this.uploaded++;
    //             this.files[i].status = 'Success';

    //             this.document.emit({ file: data.body });

    //         })
    //         .catch((err: any) => {
    //             this.files[i].status = 'Failed';
    //             this.notProcessed++;
    //             this.errors.push({ name: this.selectedFiles[i].name, status: err.statusText });
    //         });
    // }

    getProcessed() {
        return this.progress = (this.processed / this.selectedFiles.length) * 100;
    }

    removeFile(i: number) {
        this.files.splice(i, 1);
    }

    getBadge(file: any) {
        let _class = 'warning';
        switch (file.status) {
            case 'Success':
                _class = 'success';
                break;
            case 'Failed':
                _class = 'danger';
                break;
            default:
                _class = 'warning';
        }
        return _class;
    }
}
