import {FormField} from './FormField.model';
export interface vehicleModel {
  vehicle_id?: number;
  tenant_id: number;
  plate_number: string;
  customer_id: number;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  vin_number?: string;
  last_mileage?: number;
  createdAt?: Date;
  updatedAt?: Date;
  tenant?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  customers?: {
    full_name: string;
    phone_number: string;
    email: string;
    address: string;
    date_of_birth: string;
  };
}
export interface VehicleDisplayRow {
  vehicle_id: number;
  plate_number: string;
  model: string;
  ownerName: string;
  tenantName: string;
  entryDate: string;
}
export const vehicleFormFields: FormField[] = [
  {
    name: 'plate_number',
    controlName: 'licensePlate',
    label: 'License Plate',
    type: 'text',
    placeholder: 'e.g., 29A-123.45',
    required: true,
    section: 'vehicle',
  },
  {
    name: 'vin_number',
    controlName: 'vin',
    label: 'VIN',
    type: 'text',
    placeholder: '17-digit VIN',
    section: 'vehicle',
  },
  {
    name: 'make',
    controlName: 'make',
    label: 'Make',
    type: 'text',
    placeholder: 'e.g., Toyota',
    required: true,
    section: 'vehicle',
  },
  {
    name: 'model',
    controlName: 'model',
    label: 'Model',
    type: 'text',
    placeholder: 'e.g., Camry 2.5Q',
    required: true,
    section: 'vehicle',
  },
  {
    name: 'year',
    controlName: 'year',
    label: 'Year',
    type: 'number',
    placeholder: 'e.g., 2022',
    section: 'vehicle',
  },
  {
    name: 'color',
    controlName: 'color',
    label: 'Color',
    type: 'text',
    placeholder: 'e.g., Black',
    section: 'vehicle',
  },
  {
    name: 'last_mileage',
    controlName: 'mileage',
    label: 'Last Mileage',
    type: 'number',
    placeholder: 'e.g., 12345',
    section: 'vehicle',
  },
    {
    name: 'entryDate',
    controlName: 'entryDate',
    label: 'Entry Date',
    type: 'date',
    section: 'owner',
    required: true,
  },
    {
    name: 'tenant_id',
    controlName: 'tenant',
    label: 'Tenant',
    type: 'select',
    required: true,
    section: 'owner',
  },
  {
    name: 'customer_id',
    controlName: 'owner',
    label: 'Owner',
    type: 'select',
    placeholder: 'Select customer',
    required: true,
    section: 'owner',
  }

];
export interface VehicleDetail extends vehicleModel {
  vehicle_id: number;
  make: string;
  model: string;
  year: number;
  plate_number: string;
  vin_number: string;
  color: string;
  last_mileage: number;
  ownerName: string;
  entryDate: Date;
  status: {
    label: string;
    style: string;
  };
  images: {
    main: string;
    thumbnails: string[];
  };
}
