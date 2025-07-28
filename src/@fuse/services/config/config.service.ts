/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FUSE_APP_CONFIG } from '@fuse/services/config/config.constants';

@Injectable({
    providedIn: 'root'
})
export class FuseConfigService
{
    private _config: BehaviorSubject<any>;

    /**
     * Constructor
     */
    constructor(@Inject(FUSE_APP_CONFIG) config)
    {
        // Private
        this._config = new BehaviorSubject(config);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for config
     */
    get config$(): Observable<any>
    {
        return this._config.asObservable();
    }

    set config(value: any)
    {
        // Merge the new config over to the current config
        const config = this._config.getValue();

        // Execute the observable
        this._config.next(config);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resets the config to the default
     */
    reset(): void
    {
        // Set the config
        this._config.next(this.config);
    }
}
