export interface GaraModel {
    tenant_id: number;
    name: string;
    address: string;
    phone: number;
    email: string;
    owner_user_id: number;
    is_active: boolean;
}
export interface GaraListApiResponse {
    data: GaraApiItem[];
    totalCount: number;
}
export interface GaraUserApi {
    full_name: string;
    phone_number: string;
    email: string;
    role: string;
}
export interface GaraApiItem {
    tenant_id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    owner_user_id: number | null;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    owner: GaraUserApi;
}
export interface GaraQueryParams {
    pageNumber?: number;
    rowsPerPage?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}
export interface GaraDetailModel {
    tenant_id: number;
    name: string;
    address: string;
    phone: number;
    email: string;
    owner_user_id: number;
    is_active: boolean;
    createdAt: string;
    owner: GaraUserApi;
}
export interface UpdateGaraModel {
    name: string;
    address: string;
    phone: number;
    email: string;
    is_active: boolean;
}
export interface AddGaralModel {
    name: string;
    address: string;
    phone: number;
    email: string;
    ownerUser: string;
    isActive: boolean;
}
export interface GaraField {
    label: string;
    name: string;
    type: string;
    value: string | number | boolean;
    options?: { label: string; value: number }[];
    require?: boolean;
    placeholder?: string;
}

export interface GaraAddField {
    label: string;
    name: string;
    type: string;
    options?: { label: string; value: number }[];
    require?: boolean;
    placeholder?: string;
}
