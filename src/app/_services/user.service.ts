import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';
import { UserModel } from '@df_models/user.model';

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
}
