import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Customer, CustomerDisplayRow } from '../../../_models/customer.model';
import { CustomerService } from 'app/_services/customer.service';
import { GetParamRequest } from 'app/_models/api.model';
import { LoadingService } from 'app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { BaseListComponent } from '@shared/components/base-list.component';
import { UserService } from 'app/_services/user.service';
import { GarageSelectionEvent } from 'app/shared/components/garage-selector/garage-selector.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
})
export class CustomerListComponent extends BaseListComponent<CustomerDisplayRow> implements OnInit, AfterViewInit {
  @ViewChild('fullNameCell', { static: true }) fullNameCell: TemplateRef<unknown>;
  userRole = this.userService.getRole();
  cellTemplates: { [key: string]: TemplateRef<unknown> } = {};
  selectedGaraId: string | number = 'all';
  tableColumns = [
    { key: 'full_name', label: 'Full Name', className: 'text-left', sortable: true },
    { key: 'phone_number', label: 'Phone Number', className: 'text-left', sortable: true },
    { key: 'email', label: 'Email', className: 'text-left' },
    { key: 'address', label: 'Address', className: 'text-left' },
    { key: 'all', label: 'All', className: 'text-right' },
    { key: 'actions', label: 'Actions', className: 'text-right' }
  ];

  constructor(
    private customerService: CustomerService,
    public loadingService: LoadingService,
    cdr: ChangeDetectorRef,
    public toastr: ToastrService,
    private userService: UserService
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    this.loadData();
  }

  onGaraSelected(event: GarageSelectionEvent): void {
    this.selectedGaraId = event.garaId;
    this.currentPage = 1;
    this.loadData();
    this.isFilterMenuOpen = false;
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
    this.customerService.getPaginated(params).subscribe({
      next: (res) => {
        console.log(res);
        this.loadingService.hide();
        this.totalItems = res.data.totalCount;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        const customers = (res.data.rows || []) as Customer[];
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

  openConfirmModal(customerId: number): void {
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
    this.isCreateModalOpen = true;
    this.cdr.detectChanges();
  }

  openDetailModal(customerId: number): void {
    this.isDetailModalOpen = true;
    this.selectedId = customerId;
    this.cdr.detectChanges();
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
      this.openConfirmModal(event.row.id);
    }
  }

}
