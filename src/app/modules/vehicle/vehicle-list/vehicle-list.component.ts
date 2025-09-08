import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableColumn} from '../../../_models/FormField.model';
import { VehicleDisplayRow,vehicleModel} from '../../../_models/vehicle.model';
import { VehicleService } from '@df_services/vehicle.service';
import { GetParamRequest, PaginatedResponse } from 'app/_models/api.model';
import { Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LoadingService } from 'app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  isCreateModalOpen = false;
  isDetailModalOpen = false;
  searchSubject: Subject<string> = new Subject<string>();
  searchText = '';
  isFilterMenuOpen = false;
  filterColumn: keyof VehicleDisplayRow | 'all' = 'all';
  filterColumnLabel: string = 'All';
  passVehicleId: number;
  showDeleteConfirm = false;

  tableColumns: TableColumn[] = [
    { key: 'plate_number', label: 'PlateNumber', className: 'text-left' },
    { key: 'model', label: 'Model', className: 'text-left' },
    { key: 'ownerName',   label: 'Owner', className: 'text-left' },
    { key:'tenantName', label:'Gara', className: 'text-left' },
    { key: 'entryDate',   label: 'EntryDate', className: 'text-left' },
    { key: 'all', label: 'All', className: 'text-right' },
    { key: 'actions',     label: 'Actions', className: 'text-right' }
  ];

  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  paginationArray: number[] = [];
  sortColumn: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'asc';
  displayData: VehicleDisplayRow[] = [];
  constructor(
    private vehicleService: VehicleService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadVehicles();
    this.searchSubject.pipe(debounceTime(1000)).subscribe((search) => {
      this.currentPage = 1;
      this.loadVehicles();
    });
  }

  loadVehicles(): void {
    this.loadingService.show();
    const params: GetParamRequest = {
      pageNumber: this.currentPage,
      rowsPerPage: this.pageSize,
      sort: this.sortColumn,
      order: this.sortOrder,
      search: this.searchText.trim() || undefined
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
          entryDate: new Date(vehicle.createdAt)
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

    onVehicleEdited(vehicleId: number): void {
      this.loadVehicles();
    }

  changePage(page: number): void {
    if (page < 1) { page = 1; }
    if (page > this.totalPages) { page = this.totalPages; }
    this.currentPage = page;
    this.loadVehicles();
  }

  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadVehicles();
  }

  onSearchChange(search: string): void {
    this.searchText = search;
    this.searchSubject.next(search);
  }

 openConfirmModel(vehicleId: number): void {
    this.passVehicleId = vehicleId;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (!this.passVehicleId) {
      return;
    }
    this.vehicleService.delete(this.passVehicleId).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.passVehicleId = null;
        this.toastr.success('Delete vehicle successfully!', 'Success');
        this.loadVehicles();
      },
      error: () => {
        this.showDeleteConfirm = false;
        this.passVehicleId = null;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.passVehicleId = null;
    this.cdr.detectChanges();
  }

  updatePaginationArray(): void {
    const maxPagesToShow = 5;
    const pages: number[] = [];
    let startPage: number;
    let endPage: number;
    if (this.totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;
      if (this.currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (this.currentPage + maxPagesAfterCurrent >= this.totalPages) {
        startPage = this.totalPages - maxPagesToShow + 1;
        endPage = this.totalPages;
      } else {
        startPage = this.currentPage - maxPagesBeforeCurrent;
        endPage = this.currentPage + maxPagesAfterCurrent;
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i <= this.totalPages) {
        pages.push(i);
      }
    }
    this.paginationArray = pages;
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
      this.passVehicleId = vehicleId;
      this.cdr.detectChanges();
    }, 0);
  }

  closeModal(type: 'create' | 'detail'): void {
    if (type === 'create') {
      this.isCreateModalOpen = false;
    } else if (type === 'detail') {
      this.isDetailModalOpen = false;
    }
  }

  selectFilter(option: { key: keyof VehicleDisplayRow | 'all'; label: string }): void {
    this.filterColumn = option.key;
    this.filterColumnLabel = option.label;
    this.isFilterMenuOpen = false;
    this.currentPage = 1;
    this.loadVehicles();
  }

}
