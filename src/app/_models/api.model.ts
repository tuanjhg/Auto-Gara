export interface ApiResponse<T> {
    data: T;
    statusCode: number;
    msg: string;
}

export interface PaginatedData<T> {
    rows: T[];
    totalCount: number;
}

export interface PaginatedResponse<T> {
    data: PaginatedData<T>;
    statusCode?: number;
    msg?: string;
}

export interface QueryParams {
    [key: string]: string | number | boolean | undefined;
}

export interface ApiCallOptions {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    endpoint?: string;
    data?: unknown;
    params?: QueryParams;
    queryParams?: QueryParams;
    headers?: { [key: string]: string };
    responseType?: 'json' | 'blob' | 'text';
}

export interface ApiRequestData {
    body?: unknown;
    params?: QueryParams;
    query?: QueryParams;
}

export interface GetParamRequest extends QueryParams {
    pageNumber?: number;
    rowsPerPage?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}
