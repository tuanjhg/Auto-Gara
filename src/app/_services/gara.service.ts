import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddGaralModel, GaraDetailModel, GaraModel } from '@df_models/gara.model';
import { Observable, observable } from 'rxjs';
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
    getAllGara(): Observable<GaraModel[]> {
        return this.http.get<GaraModel[]>(`${this.baseUrl}/${this.endPoint}`);
    }
    getGaraById(id: string): Observable<GaraDetailModel> {
        return this.http.get<GaraDetailModel>(`${this.baseUrl}/${this.endPoint}/${id}`);
    }
    updateGara(id: number, updatedGara: GaraDetailModel): Observable<GaraDetailModel> {
        return this.http.put<GaraDetailModel>(`${this.baseUrl}/${this.endPoint}/${id}`, updatedGara);
    }
    addGara(newGara: AddGaralModel): Observable<AddGaralModel> {
        return this.http.post<AddGaralModel>(`${this.baseUrl}/${this.endPoint}`, newGara);
    }
}
