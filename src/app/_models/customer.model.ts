export interface Customer {
  id: number;
  tenant_id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}
