import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkOrder } from '../_models/work-order.model';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService extends BaseService {
   constructor(
      protected httpClient: HttpClient
    ) {
      super(
        httpClient,
        Constants.BASE_API_URL,
        Constants.END_POINT.order
      );
    }

  getWorkOrderById(id: number): Observable<WorkOrder> {
    return this.httpClient.get<WorkOrder>(`${this.baseUrl}/${this.endPoint}/${id}`);
  }
}
