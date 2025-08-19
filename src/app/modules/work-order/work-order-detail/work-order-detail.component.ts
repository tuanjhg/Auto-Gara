import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WorkOrder, workOrders, orderFormSections, ORDER_STATUS_MAP  } from '../../../_models/work-order.model';
import { vehicleModel } from '../../../_models/vehicle.model';
import { GaraDetailModel } from '../../../_models/gara.model';
import { WorkOrderService } from '../../../_services/work-order.service';

@Component({
  selector: 'app-work-order-detail',
  templateUrl: './work-order-detail.component.html',
  styleUrls: ['./work-order-detail.component.scss']
})
export class WorkOrderDetailComponent implements OnInit, OnChanges {
  @Input() workOrderId?: number;
  @Output() closeModalRequest = new EventEmitter<void>();

  workOrder: WorkOrder ;
  vehicle: vehicleModel ;
  gara: GaraDetailModel ;
  customer: { name: string } ;
  orderFormSections = orderFormSections;
  isEditMode = false;
  isLoading = false;
  errorMsg: string | null = null;

  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit(): void {
    if (this.workOrderId) {
      this.loadWorkOrder(this.workOrderId);
    } else {
      this.workOrder = { ...workOrders[0] };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workOrderId'] && this.workOrderId) {
      this.loadWorkOrder(this.workOrderId);
    }
  }

  loadWorkOrder(id: number): void {
    this.isLoading = true;
    this.errorMsg = null;
    this.workOrderService.getWorkOrderById(id).subscribe({
      next: (data) => {
        this.workOrder = { ...data };
        this.isLoading = false;
      },
      error: (err) => {
        this.workOrder = workOrders.find(w => w.id === id) || { ...workOrders[0] };
        this.errorMsg = 'cannot download order information.';
        this.isLoading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  onClose(): void {
    this.closeModalRequest.emit();
  }

  saveWorkOrder(): void {
    console.log('WorkOrder saved:', this.workOrder);
    this.isEditMode = false;
  }

  getSelectLabel(field: { options?: any[]; name: string }): string {
    if (!field.options || !this.workOrder) return '—';
    const val = this.workOrder[field.name];
    const opt = field.options.find((o: any) => o.value === val);
    return opt ? opt.label : (val ?? '—');
  }

workOrderStatusClass(status?: string): string {
  return ORDER_STATUS_MAP[status ?? '']?.class || 'bg-slate-200 text-slate-700';
}

workOrderStatusLabel(status?: string): string {
  return ORDER_STATUS_MAP[status ?? '']?.label || 'undefined';
}

}

