import { Injectable, signal } from '@angular/core';

// Refetch keys
export const APPLICATION_REVIEW_LIST_KEY = 'fetch-application-review-list'

export type LinkGeneratorRefetchKey = typeof APPLICATION_REVIEW_LIST_KEY

export type LinkGeneratorData = {
  data: any
  refetchKey?: LinkGeneratorRefetchKey
}

@Injectable({
    providedIn: 'root',
})
export class LinkGeneratorSignalService {
    public linkGeneratorData = signal<LinkGeneratorData | null>(null);

    constructor() {}
}
