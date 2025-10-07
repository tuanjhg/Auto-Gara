import { FormField, FormSection } from './FormField.model';
export type WorkOrderStatus = 'pending' | 'waiting_for_approval' | 'in_progress' | 'ready_for_final_check' | 'completed' | 'paid' | 'rejected_by_customer' | 'paused';

export interface WorkOrder {
    id: number;
    tenant: string;
    work_order_code: string;
    customer: string;
    vehicle: string;

    status: WorkOrderStatus;

    initial_notes?: string | null;
    estimated_completion_date?: string | null;
    total_quote_price?: number | null;
    total_paid_amount?: number | null;
    created_by_user_id?: number | null;
    created_at?: string;
    updated_at?: string;
    completed_at?: string | null;
    final_check_by_user_id?: number | null;
    final_check_at?: string | null;
}
export interface AddWorkOrderField {
    label: string;
    name: string;
    type: string;
    placeholder?: string;
    displayValue?: string;
    options?: { label: string; value: number }[];
    require?: boolean;
}
export interface CreateWorkOrder {
    tenant_id: number;
    customer_id: number;
    vehicle_id: number;
    initial_notes: string;
    estimated_completion_date: string;
    created_by_user_id: string;
    total_quote_price: number;
    total_paid_amount: number;
}

export const KANBAN_COLUMNS: WorkOrderStatus[] = ['pending', 'waiting_for_approval', 'in_progress', 'ready_for_final_check'];

export interface WorkerOrderApiItem {
    work_order_id: number;
    tenant_id: number;
    customer_id: number;
    vehicle_id: number;
    work_order_code: string;
    status: WorkOrderStatus;
    initial_notes?: string;
    estimated_completion_date: string;
    total_quote_price: number;
    total_paid_amount: number;
    completed_at: string;
    final_check_by_user_id: number;
    final_check_at: string;
    createdAt: string;
    updatedAt: string;
    customer: CustomerApi;
    vehicle: VehicleApi;
    tenant: TenantApi;
    has_before_media: boolean;
    has_after_media: boolean;
}

export interface CustomerApi {
    customer_id: number;
    full_name: string;
    phone_number: string;
    email: string;
}
export interface VehicleApi {
    vehicle_id: number;
    plate_number: string;
    make: string;
    model: string;
    year: number;
}
export interface TenantApi {
    tenant_id: number;
    name: string;
}
export interface WorkOrderDisplayRow {
    work_order_id: number;
    work_order_code: string;
    status: string;
    initial_notes: string;
}

export const workOrders: WorkOrder[] = [
    {
        id: 1025,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'phúc',
        vehicle: '98D1-234',
        status: 'pending',
        initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
        estimated_completion_date: '2025-08-04',
        total_quote_price: null,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-08-01T09:20:00+07:00',
        updated_at: '2025-08-01T09:20:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
    {
        id: 1025,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'khách lẻ',
        vehicle: '99B1-234',
        status: 'pending',
        initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
        estimated_completion_date: '2025-08-04',
        total_quote_price: null,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-08-01T09:20:00+07:00',
        updated_at: '2025-08-01T09:20:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
    {
        id: 1025,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'Toàn',
        vehicle: '97B3-372',
        status: 'pending',
        initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
        estimated_completion_date: '2025-08-04',
        total_quote_price: null,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-08-01T09:20:00+07:00',
        updated_at: '2025-08-01T09:20:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
    {
        id: 1025,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'Tuấn',
        vehicle: 'Khách lẻ',
        status: 'pending',
        initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
        estimated_completion_date: '2025-08-04',
        total_quote_price: null,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-08-01T09:20:00+07:00',
        updated_at: '2025-08-01T09:20:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
    {
        id: 1025,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'Thanh',
        vehicle: 'Khách lẻ',
        status: 'pending',
        initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
        estimated_completion_date: '2025-08-04',
        total_quote_price: null,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-08-01T09:20:00+07:00',
        updated_at: '2025-08-01T09:20:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
    {
        id: 1026,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'Văn',
        vehicle: 'Khách lẻ',
        status: 'pending',
        initial_notes: 'Bảo dưỡng định kỳ 20,000 km.',
        estimated_completion_date: '2025-08-05',
        total_quote_price: null,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-08-01T10:00:00+07:00',
        updated_at: '2025-08-01T10:00:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
    {
        id: 1024,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'Tú',
        vehicle: 'Khách lẻ',

        status: 'in_progress',
        initial_notes: 'Thay thế động cơ, làm lại hệ thống điện.',
        estimated_completion_date: '2025-08-03',
        total_quote_price: null,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-07-31T15:35:00+07:00',
        updated_at: '2025-08-01T11:00:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
    {
        id: 1025,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'Dũng Trần',
        vehicle: '98D2-00118',
        status: 'pending',
        initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
        estimated_completion_date: '2025-08-04',
        total_quote_price: null,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-08-01T09:20:00+07:00',
        updated_at: '2025-08-01T09:20:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
    {
        id: 1025,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'Dũng Trần',
        vehicle: '98D2-00118',
        status: 'pending',
        initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
        estimated_completion_date: '2025-08-04',
        total_quote_price: null,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-08-01T09:20:00+07:00',
        updated_at: '2025-08-01T09:20:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
    {
        id: 1022,
        tenant: 'dung',
        work_order_code: '#RO-1025',
        customer: 'Dũng Trần',
        vehicle: '98D2-00118',
        status: 'waiting_for_approval',
        initial_notes: 'Sơn lại cản trước, thay dầu.',
        estimated_completion_date: null,
        total_quote_price: 15500000,
        total_paid_amount: 0,
        created_by_user_id: 7,
        created_at: '2025-07-30T10:10:00+07:00',
        updated_at: '2025-08-01T11:40:00+07:00',
        completed_at: null,
        final_check_by_user_id: null,
        final_check_at: null,
    },
];
export const ORDER_STATUS_MAP: { value: WorkOrderStatus; label: string; class: string }[] = [
    { value: 'pending', label: 'pending', class: 'bg-yellow-100 text-yellow-800' },
    { value: 'waiting_for_approval', label: 'waiting for approval', class: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'in progress', class: 'bg-orange-100 text-orange-800' },
    { value: 'ready_for_final_check', label: 'Final check', class: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'completed', class: 'bg-green-200 text-green-900' },
    { value: 'paid', label: 'paid', class: 'bg-gray-200 text-gray-900' },
    { value: 'paused', label: 'paused', class: 'bg-gray-100 text-gray-800' },
];

export const orderFormSections: FormSection[] = [
    {
        title: 'Order Info',
        fields: [
            { name: 'tenant_id', label: 'Garage', type: 'text', required: true, placeholder: 'Select garage', section: 'owner' },
            { name: 'work_order_code', label: 'Work Order Code', type: 'text', required: true, placeholder: 'Enter code', section: 'status' },
            { name: 'vehicle_id', label: 'Vehicle', type: 'text', required: true, placeholder: 'Select vehicle', section: 'vehicle' },
            { name: 'customer_id', label: 'Customer', type: 'text', required: true, placeholder: 'Select customer', section: 'owner' },
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                required: true,
                options: ORDER_STATUS_MAP,
                placeholder: 'Select status',
                section: 'status',
            },
        ],
    },
    {
        title: 'Details',
        fields: [
            { name: 'initial_notes', label: 'Initial Notes', type: 'textarea', required: false, placeholder: 'Notes from customer', section: 'owner' },
            { name: 'estimated_completion_date', label: 'Estimated Completion Date', type: 'date', required: false, placeholder: 'mm/dd/yyyy', section: 'status' },
            { name: 'total_quote_price', label: 'Total Quote Price', type: 'number', required: false, placeholder: 'Total quote price', section: 'status' },
            { name: 'total_paid_amount', label: 'Total Paid Amount', type: 'number', required: false, placeholder: 'Total paid amount', section: 'status' },
        ],
    },
    {
        title: 'Finalization',
        fields: [
            { name: 'created_by_user_id', label: 'Created By', type: 'text', required: true, placeholder: 'Select user', section: 'owner' },
            { name: 'completed_at', label: 'Completed At', type: 'date', required: false, placeholder: 'Completed at', section: 'status' },
            { name: 'final_check_by_user_id', label: 'Final Check By', type: 'text', required: false, placeholder: 'Select user', section: 'owner' },
            { name: 'final_check_at', label: 'Final Check At', type: 'date', required: false, placeholder: 'Final check at', section: 'status' },
        ],
    },
];
