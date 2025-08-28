export interface UserModel {
    id: number;
    tenant_id: number;
    full_name: string;
    phone_number: string;
    address: string;
    phone: number;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    tenant: object;
}
export type UserSortableFields =
    | 'username' | 'email' | 'full_name' | 'role'
    | 'created_at' | 'updated_at';
export type UserRole =
    | 'admin' | 'owner' | 'mechanic' | 'accountant';
export interface UserQueryParams {
    pageNumber?: number;
    rowsPerPage?: number;
    search?: string;
    sort?: UserSortableFields;
    order?: 'asc' | 'desc';
    tenantId?: number;
    role?: UserRole;
    isActive?: boolean;
    dateFrom?: string;
    dateTo?: string;
}
