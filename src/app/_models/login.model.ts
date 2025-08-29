export interface LoginRequest {
    email: string;
    password: string;
}


export interface LoginResponse {
    accessToken: string;
    user?: {
        id: number;
        email: string;
        name?: string;
        role?: string;
    };
    message?: string;
    success?: boolean;
    refreshToken?: string;
}

export type loginModel = LoginResponse;
