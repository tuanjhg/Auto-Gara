export interface CustomerApiItem {
  customer_id: number;
  tenant_id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  address?: string;
  date_of_birth?: string;
  is_active: boolean;
  tenant?: CustomerTenantApi;
}

export interface CustomerTenantApi {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CustomerField {
  label: string;
  name: string;
  type: string;
  value: string | number | boolean;
  options?: { label: string; value: number }[];
}
export interface Customer {
  customer_id: number;
  tenant_id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  date_of_birth?: string;
  address?: string;
  is_active: boolean;
}

export interface CustomerDisplayRow {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
}
