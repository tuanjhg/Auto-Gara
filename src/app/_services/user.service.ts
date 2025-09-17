import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';
import { UserDetail, UserModel, UserQueryParams } from '@df_models/user.model';
import { GetParamRequest, PaginatedResponse } from '@df_models/api.model';

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
    return this.http.get<{ data: UserModel[] }>(`${this.baseUrl}/${this.endPoint}`, { headers });
  }

  getPaginated(params: GetParamRequest): Observable<PaginatedResponse<UserModel>> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    let httpParams = new HttpParams();
    if (params.pageNumber !== undefined) {
      httpParams = httpParams.set('pageNumber', String(params.pageNumber));
    }
    if (params.rowsPerPage !== undefined) {
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

    // Add tenant filter if provided in params
    const paramWithTenant = params as GetParamRequest & { tenantId?: number };
    if (paramWithTenant.tenantId) {
      httpParams = httpParams.set('tenant_id', String(paramWithTenant.tenantId));
      console.log('Added tenant_id filter:', paramWithTenant.tenantId);
    }

    console.log('UserService.getPaginated params:', params);
    console.log('Final HTTP params:', httpParams.toString());
    return this.http.get<PaginatedResponse<UserModel>>(`${this.baseUrl}/${this.endPoint}`, { headers, params: httpParams });
  }

  getById(id: number): Observable<{ data: UserDetail }> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get<{ data: UserDetail }>(`${this.baseUrl}/${this.endPoint}/${id}`, { headers });
  }

  create(userData: Partial<UserModel>): Observable<{ data: UserModel }> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    return this.http.post<{ data: UserModel }>(`${this.baseUrl}/${this.endPoint}`, userData, { headers });
  }

  update(id: number, userData: Partial<UserModel>): Observable<{ data: UserModel }> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    return this.http.patch<{ data: UserModel }>(`${this.baseUrl}/${this.endPoint}/${id}`, userData, { headers });
  }

  deleteUser(id: number): Observable<{ message: string }> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${this.endPoint}/${id}`, { headers });
  }
  getUserFilter(params?: UserQueryParams): Observable<{ data: UserModel[] }> {
    const token = localStorage.getItem('accessToken');
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
