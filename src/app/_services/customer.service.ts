import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../_models/customer.model';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
    constructor(protected httpClient: HttpClient) {
        super(
            httpClient,
            Constants.BASE_API_URL,
            Constants.END_POINT.customer
        );
    }
    getCustomersByTenant(tenantId: number): Observable<Customer[]> {
        if (!tenantId || Number.isNaN(tenantId)) {
            return new Observable<Customer[]>((subscriber) => {
                subscriber.next([]);
                subscriber.complete();
            });
        }
        const params = { tenant_id: tenantId };
        return this.httpClient.get<Customer[]>(
            `${this.baseUrl}/${this.endPoint}`,
            { params }
        );
    }
}
