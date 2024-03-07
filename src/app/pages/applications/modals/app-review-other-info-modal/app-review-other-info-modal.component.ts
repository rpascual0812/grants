import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component } from '@angular/core';

@Component({
    selector: 'app-app-review-other-info-modal',
    templateUrl: './app-review-other-info-modal.component.html',
    styleUrls: ['./app-review-other-info-modal.component.scss'],
})
export class AppReviewOtherInfoModalComponent {
    humanResources: Record<string, string | boolean>[] = [];
    selectedDesignation = 'Finance Officer';
    constructor(public bsModalRef: BsModalRef) {}

    handleAddHumanResource(hrName: string) {
        this.humanResources.push({
            id: new Date().getTime().toString(),
            name: hrName,
            designation: this.selectedDesignation,
            review: false,
        });
    }

    handleCancelHumanResource() {
        this.selectedDesignation = 'Finance Officer';
    }

    handleOnSelect($event: string[]) {
        this.selectedDesignation = $event.at(0) ?? 'Finance Officer';
    }

    handleReview(id: string | boolean) {
        this.humanResources = this.humanResources.map((item: Record<string, string | boolean>) => {
            if (item?.['id'] === id) {
                item['review'] = true;
            }
            return {
                ...item,
            };
        });
    }

    handleChangeEditInput($event: Event, id: string | boolean) {
        const value = ($event.target as any).value;
        this.humanResources = this.humanResources.map((item: Record<string, string | boolean>) => {
            if (item?.['id'] === id) {
                item['name'] = value;
                item['review'] = false;
            }
            return {
                ...item,
            };
        });
    }

    handleOnEditSelect($event: string[], id: string | boolean) {
        this.humanResources = this.humanResources.map((item: Record<string, string | boolean>) => {
            if (item?.['id'] === id) {
                item['designation'] = $event?.at(0) ?? 'Finance Officer';
            }
            return {
                ...item,
            };
        });
    }

    handleDeleteHumanResource(id: string | boolean) {
        this.humanResources = this.humanResources.filter((item) => item?.['id'] !== id);
    }
}
