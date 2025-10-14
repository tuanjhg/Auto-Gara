export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    email: string;
    name?: string;
    role: string;
    message?: string;
    success?: boolean;
    accessToken: string;
    refreshToken: string;
}
export interface UserInfoToken {
    id: number;
    email: string;
    role: string;
}

export interface ApiLoginResponse {
    data: LoginResponse;
    statusCode: number;
    msg: string;
}

export type loginModel = LoginResponse;
