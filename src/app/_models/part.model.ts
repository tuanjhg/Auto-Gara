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
    stock_quanlity: number | 0;
    unit: string;
    supplier: string;
    is_active: boolean;
    tenant: PartTenantApi;
}
export interface PartTenantApi{
    name: string;
    address: string;
    phone: string;
    email: string;
}
