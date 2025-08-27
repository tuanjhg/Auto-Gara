export interface UserModel {
    id: number;
    tenant_id: string;
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
