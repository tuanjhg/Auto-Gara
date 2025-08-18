import {FormField} from './FormField.model';
export interface vehicleModel {
  id?: number;
  tenant_id: number;
  plate_number: string;
  customer_id: number;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  vin_number?: string;
  last_mileage?: number;
  created_at?: Date;
  updated_at?: Date;
}
export interface VehicleDisplayRow {
  id: number;
  plateNumber: string;
  vehicleInfo: string;
  ownerName: string;
  tenantName: string;
  entryDate: Date;
}
export const vehicleFormFields: FormField[] = [
  {
    name: 'licensePlate',
    label: 'License Plate',
    type: 'text',
    placeholder: 'e.g., 29A-123.45',
    required: true,
    section: 'vehicle',
  },
  {
    name: 'vin',
    label: 'VIN (Vehicle Identification Number)',
    type: 'text',
    placeholder: '17-digit VIN',
    section: 'vehicle',
  },
  {
    name: 'make',
    label: 'Make',
    type: 'text',
    placeholder: 'e.g., Toyota',
    required: true,
    section: 'vehicle',
  },
  {
    name: 'model',
    label: 'Model',
    type: 'text',
    placeholder: 'e.g., Camry 2.5Q',
    required: true,
    section: 'vehicle',
  },
  {
    name: 'year',
    label: 'Year',
    type: 'number',
    placeholder: 'e.g., 2022',
    section: 'vehicle',
  },
  {
    name: 'color',
    label: 'Color',
    type: 'text',
    placeholder: 'e.g., Black',
    section: 'vehicle',
  },

  {
    name: 'ownerName',
    label: 'Owner Name',
    type: 'text',
    placeholder: 'Full name',
    required: true,
    section: 'owner',
  },
  {
    name: 'ownerPhone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Contact phone',
    section: 'owner',
  },

  {
    name: 'tenant',
    label: 'Tenant',
    type: 'text',
    required: true,
    section: 'owner',
  },
  {
    name: 'notes',
    label: 'Initial Complaint / Notes',
    type: 'textarea',
    placeholder: 'Describe the issue reported by the customer...',
    colspan: 2,
    section: 'owner',
  },
];
export interface VehicleDetail extends vehicleModel {
  id: number;
  make: string;
  model: string;
  year: number;
  plate_number: string;
  vin: string;
  color: string;
  engineType: string;
  mileage: string;
  notes: string;
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
  repairHistory: {
    date: string;
    service: string;
    cost: number;
    technician: string;
  }[];
}
export const mockVehicleDetails: VehicleDetail[] = [
  {
    id: 90, tenant_id: 101, customer_id: 201, make: 'Toyota', model: 'Camry', year: 2022,
    plate_number: '30H-123.45', vin: '1T1BF1FK7N4123456', color: 'Midnight Black Metallic',
    engineType: '2.5L 4-Cylinder', mileage: '45,890 km',
    notes: 'Customer reports a slight vibration at high speeds. Check tire balance and alignment. Minor scratch on the rear bumper.',
    ownerName: 'Nguyễn Văn An', entryDate: new Date('2025-08-10T08:30:00'),
    status: { label: 'In Service', style: 'warning' },
    images: {
      main: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Toyota+Camry',
      thumbnails: [
        'https://placehold.co/150x100/000000/FFFFFF/png?text=Camry+Front',
        'https://placehold.co/150x100/000000/FFFFFF/png?text=Camry+Side',
        'https://placehold.co/150x100/000000/FFFFFF/png?text=Scratch+Detail'
      ]
    },
    repairHistory: [
      { date: '2024-09-15', service: 'Regular 30,000 km Maintenance', cost: 3500000, technician: 'Lê Minh Tuấn' },
      { date: '2023-10-02', service: 'Oil Change and Tire Rotation', cost: 850000, technician: 'Lê Minh Tuấn' }
    ]
  },
  {
    id: 102, tenant_id: 102, customer_id: 202, make: 'Ford', model: 'Ranger', year: 2021,
    plate_number: '29C-987.65', vin: '1FTEX1E83MFA65432', color: 'Arctic White',
    engineType: '2.0L Bi-Turbo Diesel', mileage: '67,200 km',
    notes: 'Awaiting new brake pads. Part ordered, expected arrival on Aug 14.',
    ownerName: 'Trần Thị Bích', entryDate: new Date('2025-08-11T14:00:00'),
    status: { label: 'Awaiting Parts', style: 'info' },
    images: {
      main: 'https://placehold.co/600x400/FFFFFF/000000/png?text=Ford+Ranger',
      thumbnails: [
        'https://placehold.co/150x100/FFFFFF/000000/png?text=Ranger+Front',
        'https://placehold.co/150x100/FFFFFF/000000/png?text=Ranger+Bed',
        'https://placehold.co/150x100/FFFFFF/000000/png?text=Ranger+Interior'
      ]
    },
    repairHistory: [
      { date: '2024-02-20', service: 'Replaced air filter', cost: 600000, technician: 'Phạm Văn Cường' }
    ]
  },
  {
    id: 103, tenant_id: 103, customer_id: 203, make: 'Honda', model: 'CR-V', year: 2023,
    plate_number: '51K-456.78', vin: 'JHLRW2H59PC123789', color: 'Radiant Red Metallic',
    engineType: '1.5L VTEC Turbo', mileage: '15,540 km',
    notes: 'Standard 15,000 km service completed. Vehicle washed and ready for customer pickup.',
    ownerName: 'Lê Hoàng Dũng', entryDate: new Date('2025-08-12T09:15:00'),
    status: { label: 'Ready for Pickup', style: 'success' },
    images: {
      main: 'https://placehold.co/600x400/c21111/FFFFFF/png?text=Honda+CR-V',
      thumbnails: [
        'https://placehold.co/150x100/c21111/FFFFFF/png?text=CR-V+Angle',
        'https://placehold.co/150x100/c21111/FFFFFF/png?text=CR-V+Rear'
      ]
    },
    repairHistory: [
      { date: '2024-05-10', service: 'Replaced cabin air filter', cost: 400000, technician: 'Nguyễn Thị Hương' },
      { date: '2024-11-22', service: 'Replaced wiper blades', cost: 300000, technician: 'Nguyễn Thị Hương' }
    ]
  },
  {
    id: 92, tenant_id: 104, customer_id: 204, make: 'VinFast', model: 'VF 8', year: 2024,
    plate_number: '30K-112.23', vin: 'VN1L2FPE9RA098765', color: 'Neptune Grey',
    engineType: 'Electric (Dual Motor)', mileage: '8,300 km',
    notes: 'Customer reports issue with infotainment screen freezing. Performed software update to version 9.1. System now stable. All diagnostics clear.',
    ownerName: 'Hoàng Thị Mai', entryDate: new Date('2025-08-09T11:00:00'),
    status: { label: 'Completed', style: 'success' },
    images: {
      main: 'https://placehold.co/600x400/5d646b/FFFFFF/png?text=VinFast+VF8',
      thumbnails: [
        'https://placehold.co/150x100/5d646b/FFFFFF/png?text=VF8+Front',
        'https://placehold.co/150x100/5d646b/FFFFFF/png?text=VF8+Side',
        'https://placehold.co/150x100/5d646b/FFFFFF/png?text=VF8+Interior'
      ]
    },
    repairHistory: []
  }
];