import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';

@Injectable({
    providedIn: 'root',
})
export class CustomerService extends BaseService {
    constructor(protected httpClient: HttpClient) {
        super(httpClient, Constants.BASE_API_URL, Constants.END_POINT.customer);
    }
}
