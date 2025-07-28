import { Component, OnDestroy, OnInit } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    /**
     * Constructor
     */
    constructor(
        private _translocoService: TranslocoService
    ) { }

    ngOnInit(): void {
        // Get the available languages from transloco
         this._translocoService.setActiveLang('en');
    }

    ngOnDestroy(): void { }
}
