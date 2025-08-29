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
import { Observable, throwError, of } from 'rxjs';
import { catchError, finalize, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '@df_services/login.service';
import { LoadingService } from 'app/shared/services/loading.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    private loadingRequests = new Set<string>();

    constructor(
        private router: Router,
        private loginService: LoginService,
        private loadingService: LoadingService
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        this.startLoading(request.url);
        this.loadingService.show();
        const modifiedRequest = this.addCommonHeaders(request);
        return next.handle(modifiedRequest).pipe(
            tap((event) => {
                if (event instanceof HttpResponse && !environment.production) {
                    this.logSuccessfulRequest(event);
                }
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return this.handleUnauthorizedWithRefresh(request, next);
                }
                if(error.status === 500) {
                    this.router.navigate(['/error']);
                    return throwError(() => error);
                }
                return this.handleErrorResponse(error);
            }),
            finalize(() => {
                this.stopLoading(request.url);
                this.loadingService.hide();
            })
        );
    }

    private addCommonHeaders(request: HttpRequest<unknown>): HttpRequest<unknown> {
        let headers = request.headers;

        if (!headers.has('Content-Type') && !(request.body instanceof FormData)) {
            headers = headers.set('Content-Type', 'application/json');
        }

        if (!headers.has('Accept')) {
            headers = headers.set('Accept', 'application/json');
        }

        const token = this.getAuthToken();
        if (token && !headers.has('Authorization')) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return request.clone({ headers });
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
        localStorage.removeItem('iduser');
        localStorage.removeItem('datasession');
        localStorage.removeItem('typeuser');
        localStorage.removeItem('isadmin');

        this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
        });
    }

    private handleUnauthorizedWithRefresh(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.loginService.refreshToken().pipe(
            switchMap((res) => {
                if (res && res.accessToken) {
                    localStorage.setItem('accessToken', res.accessToken);
                    const newRequest = this.addCommonHeaders(request);
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

    private startLoading(url: string): void {
        this.loadingRequests.add(url);
    }

    private stopLoading(url: string): void {
        this.loadingRequests.delete(url);
    }
}
