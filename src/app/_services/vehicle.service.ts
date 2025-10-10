import { Injectable } from '@angular/core';
import { VehicleDisplayRow, vehicleModel } from '@df_models/vehicle.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Constants } from 'app/helper/constants';

@Injectable({
    providedIn: 'root',
})
export class VehicleService extends BaseService {
    displayData: VehicleDisplayRow[] = [];

    constructor(protected httpClient: HttpClient) {
        super(httpClient, Constants.BASE_API_URL, Constants.END_POINT.vehicle);
    }

    getVehicleDetail(vehicleId: number): Observable<vehicleModel> {
        return this.httpClient.get<vehicleModel>(`${this.baseUrl}/${this.endPoint}/${vehicleId}`);
    }
}
