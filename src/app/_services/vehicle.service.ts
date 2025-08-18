import { Injectable } from '@angular/core';
import { VehicleDisplayRow, vehicleModel } from '@df_models/vehicle.model';
import { FormField } from '@df_models/FormField.model';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Constants } from 'app/helper/constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends BaseService {
  displayData: VehicleDisplayRow[] = [];

  constructor(
    protected httpClient: HttpClient
  ) {
    super(
      httpClient,
      Constants.BASE_API_URL,
      Constants.END_POINT.vehicle
    );
  }

  getVehicles(): Observable<vehicleModel[]> {
    return this.httpClient.get<vehicleModel[]>(
      `${this.baseUrl}/${this.endPoint}`
    );
  }

  addVehicle(vehicle: vehicleModel): Observable<vehicleModel> {
    return this.httpClient.post<vehicleModel>(
      `${this.baseUrl}/${this.endPoint}`,
      vehicle
    );
  }

  getVehicleDetail(vehicleId: number): Observable<vehicleModel> {
    return this.httpClient.get<vehicleModel>(
      `${this.baseUrl}/${this.endPoint}/${vehicleId}`
    );
  }

  updateVehicle(vehicleId: number, vehicle: vehicleModel): Observable<vehicleModel> {
    return this.httpClient.put<vehicleModel>(
      `${this.baseUrl}/${this.endPoint}/${vehicleId}`,
      vehicle
    );
  }

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.baseUrl}/${this.endPoint}/${vehicleId}`
    );
  }

  createFormSections(fields: FormField[]): any[] {
    const sectionConfig = {
      vehicle: { title: 'Vehicle Information', fields: [] as FormField[] },
      owner: { title: 'Owner Details', fields: [] as FormField[] },
      status: { title: 'Initial Status', fields: [] as FormField[] },
    };

    fields.forEach(field => {
      if (field.name && sectionConfig.hasOwnProperty(field.section)) {
        (sectionConfig as any)[field.section].fields.push(field);
      }
    });

    return Object.values(sectionConfig);
  }
}