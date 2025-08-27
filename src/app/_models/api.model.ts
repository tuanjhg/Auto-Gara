export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
    errors?: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
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
