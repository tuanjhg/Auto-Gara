export type WorkOrderStatus =
  | 'pending'
  | 'waiting_for_approval'
  | 'in_progress'
  | 'ready_for_final_check'
  | 'completed'
  | 'paid'
  | 'rejected_by_customer'
  | 'paused';

export interface WorkOrder {
  id: number;
  tenant_id: number;
  work_order_code: string;
  customer_id: number;
  vehicle_id: number;

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

export const KANBAN_COLUMNS: WorkOrderStatus[] = [
  'pending',
  'waiting_for_approval',
  'in_progress',
  'ready_for_final_check',
];

export const workOrders: WorkOrder[] = [
    {
      id: 1025, tenant_id: 1,
      work_order_code: '#RO-1025',
      vehicle_id: 11, customer_id: 201,
      status: 'pending',
      initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
      estimated_completion_date: '2025-08-04',
      total_quote_price: null, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-08-01T09:20:00+07:00',
      updated_at: '2025-08-01T09:20:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,
    },
     {
      id: 1025, tenant_id: 1,
      work_order_code: '#RO-1025',
      vehicle_id: 11, customer_id: 201,
      status: 'pending',
      initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
      estimated_completion_date: '2025-08-04',
      total_quote_price: null, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-08-01T09:20:00+07:00',
      updated_at: '2025-08-01T09:20:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,
    }, {
      id: 1025, tenant_id: 1,
      work_order_code: '#RO-1025',
      vehicle_id: 11, customer_id: 201,
      status: 'pending',
      initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
      estimated_completion_date: '2025-08-04',
      total_quote_price: null, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-08-01T09:20:00+07:00',
      updated_at: '2025-08-01T09:20:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,
    }, {
      id: 1025, tenant_id: 1,
      work_order_code: '#RO-1025',
      vehicle_id: 11, customer_id: 201,
      status: 'pending',
      initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
      estimated_completion_date: '2025-08-04',
      total_quote_price: null, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-08-01T09:20:00+07:00',
      updated_at: '2025-08-01T09:20:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,
    }, {
      id: 1025, tenant_id: 1,
      work_order_code: '#RO-1025',
      vehicle_id: 11, customer_id: 201,
      status: 'pending',
      initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
      estimated_completion_date: '2025-08-04',
      total_quote_price: null, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-08-01T09:20:00+07:00',
      updated_at: '2025-08-01T09:20:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,
    },
    {
      id: 1026, tenant_id: 1,
      work_order_code: '#RO-1026',
      vehicle_id: 12, customer_id: 202,
      status: 'pending',
      initial_notes: 'Bảo dưỡng định kỳ 20,000 km.',
      estimated_completion_date: '2025-08-05',
      total_quote_price: null, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-08-01T10:00:00+07:00',
      updated_at: '2025-08-01T10:00:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,

    },
    {
      id: 1024, tenant_id: 1,
      work_order_code: '#RO-1024',
      vehicle_id: 13, customer_id: 203,
      status: 'in_progress',
      initial_notes: 'Thay thế động cơ, làm lại hệ thống điện.',
      estimated_completion_date: '2025-08-03',
      total_quote_price: null, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-07-31T15:35:00+07:00',
      updated_at: '2025-08-01T11:00:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,
    },
     {
      id: 1025, tenant_id: 1,
      work_order_code: '#RO-1025',
      vehicle_id: 11, customer_id: 201,
      status: 'pending',
      initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
      estimated_completion_date: '2025-08-04',
      total_quote_price: null, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-08-01T09:20:00+07:00',
      updated_at: '2025-08-01T09:20:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,
    }, {
      id: 1025, tenant_id: 1,
      work_order_code: '#RO-1025',
      vehicle_id: 11, customer_id: 201,
      status: 'pending',
      initial_notes: 'Kiểm tra hệ thống phanh, có tiếng kêu lạ.',
      estimated_completion_date: '2025-08-04',
      total_quote_price: null, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-08-01T09:20:00+07:00',
      updated_at: '2025-08-01T09:20:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,
    },
    {
      id: 1022, tenant_id: 1,
      work_order_code: '#RO-1022',
      vehicle_id: 14, customer_id: 204,
      status: 'waiting_for_approval',
      initial_notes: 'Sơn lại cản trước, thay dầu.',
      estimated_completion_date: null,
      total_quote_price: 15500000, total_paid_amount: 0,
      created_by_user_id: 7,
      created_at: '2025-07-30T10:10:00+07:00',
      updated_at: '2025-08-01T11:40:00+07:00',
      completed_at: null,
      final_check_by_user_id: null,
      final_check_at: null,
    }
  ];
