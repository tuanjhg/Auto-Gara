import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';

@Injectable({
    providedIn: 'root'
})
export class PartService extends BaseService {

    constructor(private http: HttpClient) {
        super(
            http,
            Constants.BASE_API_URL,
            Constants.END_POINT.part,
        );
    }
}
