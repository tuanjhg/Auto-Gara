import { Component } from '@angular/core';
import { WorkOrder, WorkOrderStatus, KANBAN_COLUMNS,workOrders } from 'app/_models/work-order.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
type SortKey = 'work_order_code' | 'estimated_completion_date' | 'total_quote_price' | 'total_paid_amount';

@Component({
  selector: 'app-order',
  templateUrl: './work-order-list.component.html'
})
export class WorkOrderListComponent {
  pageSize: number = 10;
  currentPage: number = 1;
  isAddModalOpen: boolean = false;
  isDetailModalOpen: boolean = false;
  viewMode: 'kanban' | 'list' = 'kanban';
  showMoreMap: { [key: string]: number } = {};
  searchText = '';
  statusFilter: '' | WorkOrderStatus = '';
  workOrderId: number | undefined;
  workOrders: WorkOrder[] = workOrders;
  readonly KANBAN_COLUMNS = KANBAN_COLUMNS;
  readonly KANBAN_COLUMN_LIMIT = 3;

  sort: { key: SortKey; dir: 'asc' | 'desc' } = { key: 'work_order_code', dir: 'asc' };

  STATUS_LABEL: Record<WorkOrderStatus, string> = {
    pending: 'pending',
    waiting_for_approval: 'waiting for approval',
    in_progress: 'in progress',
    ready_for_final_check: 'ready for final check',
    completed: 'completed',
    paid: 'paid',
    rejected_by_customer: 'rejected by customer',
    paused: 'paused'
  };

  workOrderColumns = [
    { key: 'work_order_code', label: 'Order Code', className: 'text-left', sortable: true },
    { key: 'vehicle_id', label: 'Vehicle', className: 'text-left', sortable: false },
    { key: 'tenant_id', label: 'Tenant', className: 'text-left', sortable: false },
    { key: 'initial_notes', label: 'Description', className: 'text-left', sortable: false },
    { key: 'estimated_completion_date', label: 'Delivery Date', className: 'text-left', sortable: true },
    { key: 'status', label: 'Status', className: 'text-left', sortable: false },
    { key: 'total_quote_price', label: 'Quote Price', className: 'text-right', sortable: true },
    { key: 'total_paid_amount', label: 'Paid Amount', className: 'text-right', sortable: true },
    { key: 'amount_due', label: 'Amount Due', className: 'text-right', sortable: false },
    { key: 'actions', label: 'Actions', className: 'text-center', sortable: false }
  ];

  constructor() {
    const saved = localStorage.getItem('workOrders');
    if (saved) {
      try {
        this.workOrders = JSON.parse(saved);
      } catch (e) {
        this.workOrders = workOrders;
      }
    }
  }

  get listFiltered(): WorkOrder[] {
    const q = this.searchText.trim().toLowerCase();

    let rows = this.workOrders.filter((w) => {
      const hitQ = !q || [
        w.work_order_code?.toLowerCase(),
        String(w.vehicle_id),
        String(w.customer_id),
        w.initial_notes?.toLowerCase(),
        w.status?.toLowerCase()
      ].some(val => val && val.includes(q));
      const hitS = !this.statusFilter || w.status === this.statusFilter;
      return hitQ && hitS;
    });

    rows = rows.sort((a, b) => {
      const dir = this.sort.dir === 'asc' ? 1 : -1;
      const k = this.sort.key;

      const va = a[k as keyof WorkOrder];
      const vb = b[k as keyof WorkOrder];

      const toCmp = (v: string | number | Date | null | undefined): string | number => {
        if (v === null || v === undefined) { return ''; }
        if (k === 'estimated_completion_date') { return new Date(v as string).getTime(); }
        return v as string | number;
      };

      const A = toCmp(va);
      const B = toCmp(vb);
      if (A < B) { return -1 * dir; }
      if (A > B) { return 1 * dir; }
      return 0;
    });

    return rows;
  }

  get paginatedList(): WorkOrder[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.listFiltered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.listFiltered.length / this.pageSize) || 1;
  }
  get paginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }
  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  setView(v: 'kanban' | 'list'): void { this.viewMode = v; }
  applyFilter(): void {}
  sortBy(key: SortKey): void {
    this.sort.dir = this.sort.key === key && this.sort.dir === 'asc' ? 'desc' : 'asc';
    this.sort.key = key;
  }

  amountDue(w: WorkOrder): number | null {
    if (w.total_quote_price == null) {
      return null;
    }
    return Math.max(0, (w.total_quote_price || 0) - (w.total_paid_amount || 0));
  }

  getWorkOrderCountByStatus(status: WorkOrderStatus): number {
    return this.workOrders.filter(w => w.status === status).length;
  }

  getOrdersByColumn(col: string): WorkOrder[] {
  return this.workOrders.filter(w => w.status === col);
}


  getVisibleOrders(col: string): WorkOrder[] {
    const all = this.getOrdersByColumn(col);
    const shown = typeof this.showMoreMap[col] === 'number' ? this.showMoreMap[col] : this.KANBAN_COLUMN_LIMIT;
    return all.slice(0, shown);
  }

  showMoreInKanban(col: string): void {
    const current = this.showMoreMap[col] ? this.showMoreMap[col] : this.KANBAN_COLUMN_LIMIT;
    const total = this.getOrdersByColumn(col).length;
    this.showMoreMap[col] = Math.min(current + this.KANBAN_COLUMN_LIMIT, total);
  }

  showLessInKanban(col: string): void {
    this.showMoreMap[col] = this.KANBAN_COLUMN_LIMIT;
  }

  getStatusStyle(status: WorkOrderStatus): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting_for_approval':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'ready_for_final_check':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-gray-200 text-gray-600';
      default:
        return '';
    }
  }

  openDetailModal(workOrderId: number ): void {
    this.isDetailModalOpen = true;
    this.workOrderId = workOrderId;
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
  }
  closeModal(modalType: 'add' | 'edit'): void {
    if (modalType === 'add') {
      this.isAddModalOpen = false;
    }else{
      this.isDetailModalOpen = false;
    }
  }

  onKanbanDrop(event: CdkDragDrop<WorkOrder[]>, col: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedOrder = event.previousContainer.data[event.previousIndex];
      movedOrder.status = col as WorkOrderStatus;
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.splice(event.currentIndex, 0, movedOrder);
      this.showStatusChangeToast(movedOrder.work_order_code, col);
    }
    this.saveKanbanData();
  }

  showStatusChangeToast(orderCode: string, newStatus: string): void {
    window?.alert?.(`Order ${orderCode} moved to ${this.STATUS_LABEL[newStatus as WorkOrderStatus]}`);
  }

  saveKanbanData(): void {
    localStorage.setItem('workOrders', JSON.stringify(this.workOrders));
  }

}
