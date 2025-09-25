export interface PartListApiResponse {
    data: PartApiItem[];
    totalCount: number;
}
export interface PartApiItem {
    part_id: number;
    tenant_id: number;
    name: string;
    part_number: string;
    default_price: number;
    cost_price?: number;
    stock_quantity: number | 0;
    unit: string;
    supplier: string;
    is_active: boolean;
    tenant: PartTenantApi;
}
export interface PartTenantApi {
    name: string;
    address: string;
    phone: string;
    email: string;
}
export interface UpdatePart {
    tenant_id: number;
    name: string;
    part_number: string;
    default_price: number;
    cost_price: number;
    stock_quantity: number;
    unit: string;
    supplier: string;
    is_active: boolean;
}

export interface PartField {
    label: string;
    name: string;
    type: string;
    value: string | number | boolean;
    options?: { label: string; value: number }[];
    require?: boolean;
}
export interface PartAddField {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    options?: { label: string; value: number }[];
    require?: boolean;
}
export interface CreatePart {
    tenant_id: number;
    name: string;
    part_number: number;
    default_price: number;
    stock_quantity: number;
    unit: string;
    supplier: string;
    is_active: boolean;
}
export interface PartDisplayRow {
    part_id: number;
    part_number: string;
    name: string;
    supplier: string;
    tenant: string;
    default_price: number;
    is_active: boolean;
}
