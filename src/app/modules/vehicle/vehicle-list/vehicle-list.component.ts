import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableColumn } from '../../../_models/FormField.model';
import { VehicleDisplayRow, vehicleModel } from '../../../_models/vehicle.model';
import { VehicleService } from '@df_services/vehicle.service';
import { GetParamRequest, PaginatedResponse } from 'app/_models/api.model';
import { LoadingService } from 'app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { BaseListComponent } from 'app/shared/components/base-list.component';
import { GarageSelectionEvent } from 'app/shared/components/garage-selector/garage-selector.component';
import { UserService } from 'app/_services/user.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent extends BaseListComponent<VehicleDisplayRow> implements OnInit {
  tableColumns: TableColumn[] = [
    { key: 'plate_number', label: 'PlateNumber', className: 'text-left', sortable: true },
    { key: 'model', label: 'Model', className: 'text-left', sortable: true },
    { key: 'customerName', label: 'Customer', className: 'text-left' },
    { key: 'tenantName', label: 'Gara', className: 'text-left' },
    { key: 'createdAt', label: 'EntryDate', className: 'text-left', sortable: true },
    { key: 'all', label: 'All', className: 'text-right' },
    { key: 'actions', label: 'Actions', className: 'text-right' }
  ];
  selectedGaraId: string | number = 'all';
  userRole = this.userService.getRole();

  constructor(
    private vehicleService: VehicleService,
    public loadingService: LoadingService,
    cdr: ChangeDetectorRef,
    private userService: UserService,
    public toastr: ToastrService
  ) {
    super(cdr);
    this.sortColumn = 'createdAt';
    this.sortOrder = 'asc';
  }

  ngOnInit(): void {
    this.loadData();
  }

  onGaraSelected(event: GarageSelectionEvent): void {
    this.selectedGaraId = event.garaId;
    this.currentPage = 1;
    this.loadData();
  }

  loadData(): void {
    this.loadingService.show();
    const params: GetParamRequest = {
      pageNumber: this.currentPage,
      rowsPerPage: this.pageSize,
      sort: this.sortColumn,
      order: this.sortOrder,
      search: this.searchText.trim() || undefined,
      tenant_id: this.selectedGaraId !== 'all' ? this.selectedGaraId : undefined
    };
    this.vehicleService.getPaginated(params).subscribe({
      next: (res: PaginatedResponse<vehicleModel>) => {
        this.loadingService.hide();
        this.totalItems = res.data.totalCount;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.displayData = res.data.rows.map(vehicle => ({
          vehicle_id: vehicle.vehicle_id,
          plate_number: vehicle.plate_number,
          model: `${vehicle.make} ${vehicle.model}`,
          customerName: vehicle.customers?.full_name || 'Không rõ',
          tenantName: vehicle.tenant?.name || 'Không rõ',
          createdAt: vehicle.createdAt ? this.formatDateDDMMYYYY(vehicle.createdAt) : ''
        }));
        this.updatePaginationArray();
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingService.hide();
        this.displayData = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.updatePaginationArray();
        this.cdr.detectChanges();
      }
    });
  }

  onVehicleEdited(_: number): void {
    this.loadData();
  }

  openConfirmModel(vehicleId: number): void {
    this.selectedId = vehicleId;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (!this.selectedId) {
      return;
    }
    this.vehicleService.delete(this.selectedId).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.selectedId = null;
        this.toastr.success('Delete vehicle successfully!', 'Success');
        this.loadData();
      },
      error: () => {
        this.showDeleteConfirm = false;
        this.selectedId = null;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.selectedId = null;
    this.cdr.detectChanges();
  }

  openCreateModal(): void {
    setTimeout(() => {
      this.isCreateModalOpen = true;
      this.cdr.detectChanges();
    }, 0);
  }

  openDetailModal(vehicleId: number): void {
    setTimeout(() => {
      this.isDetailModalOpen = true;
      this.selectedId = vehicleId;
      this.cdr.detectChanges();
    }, 0);
  }

  closeModal(type: 'create' | 'detail', added?: boolean): void {
    if (type === 'create') {
      this.isCreateModalOpen = false;
      if (added) {
        this.loadData();
      }
    } else if (type === 'detail') {
      this.isDetailModalOpen = false;
      if (added) {
        this.loadData();
      }
    }
    this.cdr.detectChanges();
  }

  handleTableAction(event: { type: string; row: VehicleDisplayRow }): void {
    if (event.type === 'edit') {
      this.openDetailModal(event.row.vehicle_id);
    } else if (event.type === 'delete') {
      this.openConfirmModel(event.row.vehicle_id);
    }
  }

}
