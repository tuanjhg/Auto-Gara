import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Constants } from 'app/helper/constants';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, LoginRequest } from '@df_models/login.model';
import { ApiRequestData } from '../_models/api.model';

@Injectable({
    providedIn: 'root'
})
export class LoginService extends BaseService<LoginResponse> {
    constructor(
        protected httpClient: HttpClient
    ) {
        super(
            httpClient,
            Constants.BASE_API_URL,
            Constants.END_POINT.auth,
        );
    }


    login(email: string, password: string): Observable<LoginResponse> {
        const loginData: LoginRequest = {
            email,
            password
        };

        const requestData: ApiRequestData = {
            body: loginData
        };

        return this.call<LoginResponse>('POST', requestData, 'login');
    }

    refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
        const refreshToken = localStorage.getItem('refreshToken') || '';
        return this.httpClient.post<{ accessToken: string; refreshToken: string }>(
            `${this.baseUrl}/${this.endPoint}/refresh-token`,
            { refreshToken }
        );
    }
    logout(): void {
        const refreshToken = localStorage.getItem('refreshToken') || '';
        if (!refreshToken) {
            return;
        }
        this.httpClient.post(`${this.baseUrl}/${this.endPoint}/logout`, { refreshToken });
    }
}
