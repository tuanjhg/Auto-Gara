export interface Customer {
  customer_id: number;
  tenant_id: number;
  full_name: string;
  phone_number: string;
  email?: string;
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
