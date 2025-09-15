import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddGaralModel, GaraDetailModel, GaraListApiResponse, GaraModel, GaraQueryParams, UpdateGaraModel } from '@df_models/gara.model';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';
import { QueryParams } from '@df_models/api.model';

@Injectable({
    providedIn: 'root'
})
export class GaraService extends BaseService{

    constructor(private http: HttpClient) {
        super(
            http,
            Constants.BASE_API_URL,
            Constants.END_POINT.garaList,
        );
    }
    getAllGara(): Observable<GaraListApiResponse> {
        return this.http.get<GaraListApiResponse>(`${this.baseUrl}/${this.endPoint}`);
    }
}
