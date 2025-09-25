import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { Customer, CustomerDisplayRow } from '../../../_models/customer.model';
import { CustomerService } from 'app/_services/customer.service';
import { GaraService } from 'app/_services/gara.service';
import { GaraApiItem, GaraListApiResponse } from '../../../_models/gara.model';
import { GetParamRequest } from 'app/_models/api.model';
import { LoadingService } from 'app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { SelectedTenantService } from 'app/shared/services/select-tenant.service';
import { BaseListComponent } from '@shared/components/base-list.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
})
export class CustomerListComponent extends BaseListComponent<CustomerDisplayRow> implements OnInit, AfterViewInit {
  @ViewChild('fullNameCell', { static: true }) fullNameCell: TemplateRef<unknown>;
  cellTemplates: { [key: string]: TemplateRef<unknown> } = {};
  garas: GaraApiItem[] = [];
  selectedGarage: string | number = 'all';
  isGarageMenuOpen = false;
  tableColumns = [
      { key: 'full_name',   label: 'Full Name',   className: 'text-left', sortable: true },
      { key: 'phone_number',label: 'Phone Number',className: 'text-left', sortable: true },
      { key: 'email',       label: 'Email',       className: 'text-left' },
      { key: 'address',     label: 'Address',     className: 'text-left' },
      { key: 'all',         label: 'All',         className: 'text-right' },
      { key: 'actions',     label: 'Actions',     className: 'text-right' }
    ];

  constructor(
    private customerService: CustomerService,
    private garaService: GaraService,
    public loadingService: LoadingService,
    cdr: ChangeDetectorRef,
    public toastr: ToastrService,
    private selectedTenant: SelectedTenantService
  ) {
    super(cdr);
  }

  get selectedGarageLabel(): string {
    if (this.selectedGarage === 'all') {
      return 'All';
    }
    const found = this.garas.find(g => g.tenant_id === this.selectedGarage);
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
    this.isFilterMenuOpen = false;
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
    this.customerService.getPaginated(params).subscribe({
      next: (res) => {
        this.loadingService.hide();
        this.totalItems = res.totalCount;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        const customers = (res.data || []) as Customer[];
        this.displayData = customers.map(customer => ({
          id: customer.customer_id,
          full_name: customer.full_name,
          phone_number: customer.phone_number,
          email: customer.email || 'N/A',
          address: customer.address || 'N/A',
          is_active: customer.is_active,
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

  onCustomerEdited(_: number): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.cellTemplates = { full_name: this.fullNameCell };
  }

  openConfirmModel(customerId: number): void {
    this.selectedId = customerId;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (!this.selectedId) {
      return;
    }
    this.customerService.delete(this.selectedId).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.selectedId = null;
        this.toastr.success('Delete customer successfully!', 'Success');
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

  openDetailModal(customerId: number): void {
    setTimeout(() => {
      this.isDetailModalOpen = true;
      this.selectedId = customerId;
      this.cdr.detectChanges();
    }, 0);
  }

 closeModal(type: 'create' | 'detail', added?: boolean): void {
  if (type === 'create') {
    this.isCreateModalOpen = false;
  } else if (type === 'detail') {
    this.isDetailModalOpen = false;
  }
  if (!!added) {
    this.loadData();
  }
  this.cdr.detectChanges();
}

  handleTableAction(event: { type: string; row: CustomerDisplayRow }): void {
    if (event.type === 'edit') {
      this.openDetailModal(event.row.id);
    } else if (event.type === 'delete') {
      this.openConfirmModel(event.row.id);
    }
  }

}
