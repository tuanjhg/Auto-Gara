import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddGaralModel, GaraDetailModel, GaraListApiResponse, GaraModel, GaraQueryParams, UpdateGaraModel } from '@df_models/gara.model';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';

@Injectable({
    providedIn: 'root'
})
export class GaraService extends BaseService {

    constructor(private http: HttpClient) {
        super(
            http,
            Constants.BASE_API_URL,
            Constants.END_POINT.garaList,
        );
    }
    getAllGara(params?: GaraQueryParams): Observable<GaraListApiResponse> {
        let httpParams = new HttpParams();
        if (params) {
            if (params.pageNumber !== undefined && params.pageNumber !== null) {
                httpParams = httpParams.set('pageNumber', String(params.pageNumber));
            }
            if (params.rowsPerPage !== undefined && params.rowsPerPage !== null) {
                httpParams = httpParams.set('rowsPerPage', String(params.rowsPerPage));
            }
            if (params.search) {
                httpParams = httpParams.set('search', params.search);
            }
            if (params.sort) {
                httpParams = httpParams.set('sort', params.sort);
            }
            if (params.order) {
                httpParams = httpParams.set('order', params.order);
            }
        }

        return this.http.get<GaraListApiResponse>(`${this.baseUrl}/${this.endPoint}`, { params: httpParams });
    }
    getGaraById(id: number): Observable<GaraDetailModel> {
        return this.http.get<GaraDetailModel>(`${this.baseUrl}/${this.endPoint}/${id}`);
    }
    updateGara(id: number, updatedGara: UpdateGaraModel): Observable<GaraDetailModel> {
        return this.http.put<GaraDetailModel>(`${this.baseUrl}/${this.endPoint}/${id}`, updatedGara);
    }
    addGara(newGara: AddGaralModel): Observable<AddGaralModel> {
        return this.http.post<AddGaralModel>(`${this.baseUrl}/${this.endPoint}`, newGara);
    }
}
