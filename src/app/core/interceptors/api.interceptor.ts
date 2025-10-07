import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '@df_services/login.service';


@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private loginService: LoginService
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const isLoginOrRefresh =
            request.url.includes('/login') || request.url.includes('/refresh-token');
        let modifiedRequest = request;
        const token = this.getAuthToken();
        if (token && !isLoginOrRefresh) {
            modifiedRequest = this.addAuthorizationHeader(request, token);
        }

        return next.handle(modifiedRequest).pipe(
            tap((event) => {
                if (event instanceof HttpResponse && !environment.production) {
                    this.logSuccessfulRequest(event);
                }
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!isLoginOrRefresh && refreshToken && refreshToken.trim() !== '') {
                        return this.handleUnauthorizedWithRefresh(request, next);
                    } else {
                        this.handleUnauthorized();
                        return throwError(() => ({ status: 401, userMessage: 'Session expired. Please login again.' }));
                    }
                }
                if (error.status === 500) {
                    this.router.navigate(['/error']);
                    return throwError(() => error);
                }
                return this.handleErrorResponse(error);
            })
        );
    }

    private addAuthorizationHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private logSuccessfulRequest(response: HttpResponse<unknown>): void {
        console.log(' API Success:', {
            url: response.url,
            status: response.status,
            method: 'GET/POST/PUT/DELETE'
        });
    }

    private handleErrorResponse(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unexpected error occurred';

        if (!environment.production) {
            console.error('API Error:', {
                url: error.url,
                status: error.status,
                error: error.error,
                message: error.message
            });
        }

        errorMessage = error.error?.message || `Server error (${error.status})`;

        return throwError(() => ({
            ...error,
            userMessage: errorMessage
        }));
    }

    private handleUnauthorized(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');

        this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
        });
    }

    private handleUnauthorizedWithRefresh(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.loginService.refreshToken().pipe(
            switchMap((res) => {
                if (res && res.accessToken && res.refreshToken) {
                    try {
                        localStorage.setItem('accessToken', res.accessToken);
                        localStorage.setItem('refreshToken', res.refreshToken);
                    } catch (e) {
                        this.handleUnauthorized();
                        return throwError(() => ({ status: 401, userMessage: 'Session expired. Please login again.' }));
                    }
                    const newRequest = this.addAuthorizationHeader(request, res.accessToken);
                    return next.handle(newRequest);
                } else {
                    this.handleUnauthorized();
                    return throwError(() => ({ status: 401, userMessage: 'Session expired. Please login again.' }));
                }
            }),
            catchError(() => {
                this.handleUnauthorized();
                return throwError(() => ({ status: 401, userMessage: 'Session expired. Please login again.' }));
            })
        );
    }

    private getAuthToken(): string | null {
        return localStorage.getItem('accessToken');
    }
}
