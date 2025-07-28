import { Observable, map, BehaviorSubject, catchError, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetValueSavedOrder } from '@df_models/order-meta.model';
import { PlaceOrderNew } from '@df_models/place-order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderMetaService extends BaseService {
    public _totalSavedOrder$: BehaviorSubject<number>= new BehaviorSubject<number>(0);
    constructor(
        protected httpClient: HttpClient
    ) {
        super(
            httpClient,
            Constants.BASE_API_URL,
            Constants.END_POINT.orderMeta,
        );
        const totalSavedOrder = localStorage.getItem('totalSavedOrder');
        if (totalSavedOrder) {
            if (this._totalSavedOrder$.value != Number(totalSavedOrder)) {
                this._totalSavedOrder$.next(Number(totalSavedOrder));
            }
        } else {
            const idcie = this.getDataSession('currentcie') || 0;
            if (idcie) {
                this.getNumberSavedOrders().subscribe();
            }
        }
    }

    get totalSavedOrder$(): Observable<number>
    {
        return this._totalSavedOrder$.asObservable();
    }

    setTotalSavedOrder(total: number): void
    {
        localStorage.setItem('totalSavedOrder', total.toString());
        this._totalSavedOrder$.next(total);
    }

    getAllSavedOrders(pageNumber: number, pageSize: number, sort?: string, orderId?: string, search?: string,
        createdUser?: number): Observable<GetValueSavedOrder[]> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('rowsPerPage', pageSize.toString())
            .set('createdUser', createdUser || localStorage.getItem('iduser'))
            .set('idcie', this.getDataSession('currentcie') || 0);


        if (sort && orderId) {
            params = params.set('sort', sort).set('order', orderId);
        }

        if (search) {
            params = params.set('search', search);
        }

        return this.httpClient
            .get<GetValueSavedOrder[]>(`${this.baseUrl}/${this.endPoint}/getManyOrders`, {
                params,
            })
            .pipe(map((data: GetValueSavedOrder[]) => data));
    }

    getDetailByOrderId(orderId?: number, orderIdPrextra?: number): Observable<GetValueSavedOrder> {
        let params = new HttpParams();

        if (orderId) {
            params = params.set('orderId', orderId);
        } else if (orderIdPrextra) {
            params = params.set('orderIdPrextra', orderIdPrextra);
        }
        return params.has('orderId') || params.has('orderIdPrextra') ?
            this.httpClient.get<GetValueSavedOrder>(
                `${this.baseUrl}/${this.endPoint}/getDetailByOrderId`,
                { params }
            ).pipe(
                map((data: GetValueSavedOrder) => data),
                catchError(() => of(null)) // Handle errors by returning null (optional)
            ) :
            of(null);
    }

    deleteDetailOrder(orderId: number | null, orderIdPrextra: number | null): Observable<string | null> {
        let params = new HttpParams();

        if (orderId) {
            params = params.set('orderId', orderId.toString());
        } else if (orderIdPrextra) {
            params = params.set('orderIdPrextra', orderIdPrextra.toString());
        }

        return this.httpClient.delete<{ message: string }>(`${this.baseUrl}/${this.endPoint}/deleteOrderMeta`, { params })
            .pipe(map(data => data.message));
    }

    createOrderMeta(data: PlaceOrderNew, orderPriceTotal: number, PONumber?: string, stampId?: number): Observable<object> {
        let params: object = {
            idcie: this.getDataSession('currentcie') || 0,
            language: this.curLangue || 'all',
            orderPriceTotal,
            orderMeta: JSON.stringify(data),
            stampId
        };

        if (PONumber) {
            params = {
                ...params,
                PONumber
            };
        }

        return this.httpClient.post(`${this.baseUrl}/${this.endPoint}/createOrderMeta`, params).pipe(map((_data: object) => _data));
    }

    updateOrderMeta(orderId: string, status: string, file, poNumber?): Observable<object> {
        const formData = new FormData();
        formData.append('orderId', orderId);

        if (poNumber) {
            formData.append('PONumber', poNumber);
        }

        if (status && file) {
            formData.append('status', status);
            formData.append('pdfSigned', file, `Order-${orderId}.pdf`);
        }


        return this.httpClient.put(`${this.baseUrl}/${this.endPoint}/updateOrderMeta`, formData).pipe(map((_data: object) => _data));
    }

    getNumberSavedOrders(): Observable<{ total: number }> {
        const params = {
            idcie: this.getDataSession('currentcie') || 0,
            createdUser: localStorage.getItem('iduser') || ''
        };
        const httpparams = new HttpParams({ fromObject: params }).toString();

        return this.httpClient.get(`${this.baseUrl}/${this.endPoint}/getNumberSavedOrders?${httpparams}`)
            .pipe(map((data: { total: number  }) => {
               this.setTotalSavedOrder(data.total);
               return data;
        }));
    }
}
