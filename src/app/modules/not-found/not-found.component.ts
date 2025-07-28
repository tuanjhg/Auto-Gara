import { Component, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
})
export class NotFoundPageComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     */
    constructor(
        private router: Router,
    ) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }
}
