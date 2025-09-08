import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, PaginatedResponse, QueryParams, ApiCallOptions, ApiRequestData } from '../_models/api.model';

@Injectable()
export class BaseService<T = unknown> {
    protected readonly fullUrl: string;

    constructor(
        protected httpClient: HttpClient,
        protected baseUrl: string = environment.apiUrl,
        protected endPoint: string,
    ) {
        this.fullUrl = this.constructFullUrl(baseUrl, endPoint);
    }

    get currentEndpoint(): string {
        return this.fullUrl;
    }


    apiCall<R = T>(options: ApiCallOptions): Observable<R> {
        const {
            method,
            endpoint = '',
            data,
            params,
            queryParams,
            headers,
            responseType = 'json'
        } = options;

        const url = endpoint ? `${this.fullUrl}/${endpoint}` : this.fullUrl;

        const httpParams = this.buildHttpParams(queryParams || params);

        const httpHeaders = this.buildHttpHeaders(headers);

        const requestOptions: {
            headers?: HttpHeaders;
            params?: HttpParams;
            body?: unknown;
            responseType?: any;
        } = {
            headers: httpHeaders,
            params: httpParams,
            responseType
        };

        if (['POST', 'PUT', 'PATCH'].includes(method) && data) {
            requestOptions.body = data;
        }

        let request: Observable<unknown>;

        switch (method) {
            case 'GET':
                request = this.httpClient.get(url, requestOptions);
                break;
            case 'POST':
                request = this.httpClient.post(url, requestOptions.body, requestOptions);
                break;
            case 'PUT':
                request = this.httpClient.put(url, requestOptions.body, requestOptions);
                break;
            case 'PATCH':
                request = this.httpClient.patch(url, requestOptions.body, requestOptions);
                break;
            case 'DELETE':
                if (data) {
                    request = this.httpClient.request('DELETE', url, {
                        ...requestOptions,
                        body: data
                    });
                } else {
                    request = this.httpClient.delete(url, requestOptions);
                }
                break;
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }

        return request.pipe(
            map((response) => {
                if (responseType === 'json') {
                    return this.extractData<R>(response as ApiResponse<R> | R);
                }
                return response as R;
            }),
            catchError(this.handleError.bind(this))
        );
    }

    call<R = T>(method: ApiCallOptions['method'], data?: ApiRequestData, endpoint?: string): Observable<R> {
        const options: ApiCallOptions = {
            method,
            endpoint
        };

        if (data) {
            if (['GET', 'DELETE'].includes(method)) {
                options.queryParams = data.query || data.params;
            } else {
                options.data = data.body;
                options.queryParams = data.query || data.params;
            }
        }

        return this.apiCall<R>(options);
    }

    getAll(params?: QueryParams): Observable<T[]> {
        return this.call<T[]>('GET', { query: params });
    }

    getPaginated(params?: QueryParams): Observable<PaginatedResponse<T>> {
        return this.call<PaginatedResponse<T>>('GET', { query: params }).pipe(
            map(response => this.normalizePaginatedResponse<T>(response))
        );
    }

    getById(id: string | number): Observable<T> {
        return this.call<T>('GET', undefined, id.toString());
    }

    create(data: Partial<T>): Observable<T> {
        return this.call<T>('POST', { body: data });
    }

    update(id: string | number, data: Partial<T>): Observable<T> {
        return this.call<T>('PUT', { body: data }, id.toString());
    }

    patch(id: string | number, data: Partial<T>): Observable<T> {
        return this.call<T>('PATCH', { body: data }, id.toString());
    }

    delete(id: string | number): Observable<void> {
        return this.call<void>('DELETE', undefined, id.toString());
    }


    search(query: string, params?: QueryParams): Observable<T[]> {
        const searchParams = { ...params, search: query };
        return this.call<T[]>('GET', { query: searchParams }, 'search');
    }

    protected buildHttpParams(params?: QueryParams): HttpParams {
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach((key) => {
                const value = params[key];
                if (value !== undefined && value !== null && value !== '') {
                    httpParams = httpParams.set(key, value.toString());
                }
            });
        }

        return httpParams;
    }

    protected buildHttpHeaders(headers?: { [key: string]: string }): HttpHeaders {
        let httpHeaders = new HttpHeaders();

        if (headers) {
            Object.keys(headers).forEach((key) => {
                httpHeaders = httpHeaders.set(key, headers[key]);
            });
        }

        return httpHeaders;
    }

    protected extractData<U>(response: ApiResponse<U> | U): U {
        if (response && typeof response === 'object' && 'data' in response) {
            if ('totalCount' in response) {
                return response as U;
            }
            return (response as ApiResponse<U>).data;
        }
        return response as U;
    }

    protected normalizePaginatedResponse<U>(response: any): PaginatedResponse<U> {
        if (response) {
            return {
                data: response.data || [],
                totalCount: response.totalCount || 0
            };
        }

        if (response && Array.isArray(response.data)) {
            return {
                data: response.data,
                totalCount: response.totalCount || 0
            };
        }

        if (Array.isArray(response)) {
            return {
                data: response,
                totalCount: response.length
            };
        }

        return {
            data: [],
            totalCount: 0
        };
    }

    protected handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error);
    }

    protected getRequestOptions(additionalHeaders?: { [key: string]: string }): { headers: HttpHeaders } {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        if (additionalHeaders) {
            Object.keys(additionalHeaders).forEach((key) => {
                headers = headers.set(key, additionalHeaders[key]);
            });
        }

        return { headers };
    }

    private constructFullUrl(baseUrl: string, endPoint: string): string {
        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        const cleanEndPoint = endPoint.replace(/^\//, '');
        return `${cleanBaseUrl}/${cleanEndPoint}`;
    }


}

