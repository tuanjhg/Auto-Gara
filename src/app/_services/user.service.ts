import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';
import { UserModel, UserQueryParams } from '@df_models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: HttpClient) {
    super(
      http,
      Constants.BASE_API_URL,
      Constants.END_POINT.user,
    );
  }
  getAllUser(): Observable<{ data: UserModel[] }> {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get<{ data: UserModel[] }>(`${this.baseUrl}/${this.endPoint}`,{ headers });
  }
  getUserFilter(params?: UserQueryParams): Observable<{ data: UserModel[] }> {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

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
      if (params.tenantId !== undefined && params.tenantId !== null) {
        httpParams = httpParams.set('tenantId', String(params.tenantId));
      }
      if (params.role) {
        httpParams = httpParams.set('role', params.role);
      }
      if (params.isActive !== undefined && params.isActive !== null) {
        httpParams = httpParams.set('isActive', String(params.isActive));
      }
      if (params.dateFrom) {
        httpParams = httpParams.set('dateFrom', params.dateFrom);
      }
      if (params.dateTo) {
        httpParams = httpParams.set('dateTo', params.dateTo);
      }
    }
    return this.http.get<{ data: UserModel[] }>(`${this.baseUrl}/${this.endPoint}`,{ headers, params: httpParams  });
  }
}
