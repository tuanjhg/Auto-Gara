import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableColumn } from '../../../_models/FormField.model';
import { VehicleDisplayRow, vehicleModel } from '../../../_models/vehicle.model';
import { VehicleService } from '@df_services/vehicle.service';
import { GaraService } from '@df_services/gara.service';
import { GaraApiItem, GaraListApiResponse } from '../../../_models/gara.model';
import { SelectedTenantService } from 'app/shared/services/select-tenant.service';
import { GetParamRequest, PaginatedResponse } from 'app/_models/api.model';
import { LoadingService } from 'app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { BaseListComponent } from 'app/shared/components/base-list.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent extends BaseListComponent<VehicleDisplayRow> implements OnInit {
  tableColumns: TableColumn[] = [
    { key: 'plate_number', label: 'PlateNumber', className: 'text-left', sortable: true },
    { key: 'model', label: 'Model', className: 'text-left', sortable: true },
    { key: 'ownerName', label: 'Owner', className: 'text-left' },
    { key: 'tenantName', label: 'Gara', className: 'text-left' },
    { key: 'createdAt', label: 'EntryDate', className: 'text-left', sortable: true },
    { key: 'all', label: 'All', className: 'text-right' },
    { key: 'actions', label: 'Actions', className: 'text-right' }
  ];


  garas: GaraApiItem[] = [];
  selectedGarage: string | number = 'all';
  isGarageMenuOpen = false;

  constructor(
    private vehicleService: VehicleService,
    private garaService: GaraService,
    public loadingService: LoadingService,
    cdr: ChangeDetectorRef,
    public toastr: ToastrService,
    private selectedTenant: SelectedTenantService
  ) {
    super(cdr);
    this.sortColumn = 'createdAt';
    this.sortOrder = 'asc';
  }


  get selectedGarageLabel(): string {
    if (this.selectedGarage === 'all') {
      return 'All';
    }
    const found = this.garas.find(gara => gara.tenant_id === this.selectedGarage);
    return found ? found.name : 'All';
  }

  ngOnInit(): void {
    this.loadGaras();
    const initTenant = this.selectedTenant.getTenantId();
    this.selectedGarage = initTenant != null ? initTenant : 'all';
    this.loadData();
  }

  selectGarage(garage: GaraApiItem | { value: 'all', label: string }): void {
    if ('tenant_id' in garage) {
      this.selectedGarage = garage.tenant_id;
    } else {
      this.selectedGarage = garage.value;
    }
    this.selectedTenant.setTenantId(this.selectedGarage === 'all' ? null : Number(this.selectedGarage), { syncUrl: true });
    this.currentPage = 1;
    this.loadData();
    this.isGarageMenuOpen = false;
  }

  loadGaras(): void {
    this.garaService.getAllGara().subscribe({
      next: (res: GaraListApiResponse) => {
        this.garas = Array.isArray(res) ? res : (res.data || []);
        const hasSelected =
          this.selectedGarage === 'all' ||
          this.garas.some(gara => gara.tenant_id === this.selectedGarage);
        if (!hasSelected) {
          this.selectedGarage = 'all';
          this.selectedTenant.setTenantId(null, { syncUrl: true });
        }
      },
      error: () => {
        this.garas = [];
        this.selectedGarage = 'all';
        this.selectedTenant.setTenantId(null, { syncUrl: true });
      }
    });
  }

  loadData(): void {
    this.loadingService.show();
    const params: GetParamRequest = {
      pageNumber: this.currentPage,
      rowsPerPage: this.pageSize,
      sort: this.sortColumn,
      order: this.sortOrder,
      search: this.searchText.trim() || undefined,
      tenant_id: this.selectedGarage !== 'all' ? this.selectedGarage : undefined
    };
    this.vehicleService.getPaginated(params).subscribe({
      next: (res: PaginatedResponse<vehicleModel>) => {
        this.loadingService.hide();
        this.totalItems = res.totalCount;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.displayData = res.data.map(vehicle => ({
          vehicle_id: vehicle.vehicle_id,
          plate_number: vehicle.plate_number,
          model: `${vehicle.make} ${vehicle.model}`,
          ownerName: vehicle.customers?.full_name || 'Không rõ',
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
