import { Observable} from 'rxjs';

import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { loginModel } from '@df_models/login.model';

@Injectable({
    providedIn: 'root'
})
export class LoginService extends BaseService {
    constructor(
        protected httpClient: HttpClient
    ) {
        super(
            httpClient,
            Constants.BASE_API_URL,
            Constants.END_POINT.auth,
        );
    }
    login(email: string, password: string): Observable<loginModel> {
       let params = new HttpParams()
            .set('email', email)
            .set('password', password);
        return this.httpClient.post<loginModel>(`${this.baseUrl}/${this.endPoint}/login`, params);
    }
}