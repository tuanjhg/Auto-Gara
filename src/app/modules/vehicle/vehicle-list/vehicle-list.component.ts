import { Component, OnInit } from '@angular/core';
import { TableColumn} from '../../../_models/FormField.model';
import { VehicleDisplayRow,vehicleModel} from '../../../_models/vehicle.model';
import { VehicleService } from '@df_services/vehicle.service';
import { Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const customersFromApi = [
  { id: 101, fullName: 'Nguyễn Văn An', tenant_id: 1 },
  { id: 102, fullName: 'Trần Thị Bích', tenant_id: 2 },
  { id: 103, fullName: 'Lê Minh Long', tenant_id: 3 },
];

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
  filterColumnLabel: string = 'Tất cả';
  passVehicleId;

  tableColumns: TableColumn[] = [
    { key: 'plateNumber', label: 'Biển số', className: 'text-left' },
    { key: 'vehicleInfo', label: 'Hãng xe & Mẫu xe', className: 'text-left' },
    { key: 'ownerName',   label: 'Chủ sở hữu', className: 'text-left' },
    { key:'tenantName', label:'Gara', className: 'text-left' },
    { key: 'entryDate',   label: 'Ngày vào xưởng', className: 'text-left' },
    { key: 'all', label: 'Tất cả', className: 'text-right' },
    { key: 'actions',     label: 'Hành động', className: 'text-right' }
  ];

  activeData: VehicleDisplayRow[] = [];
  displayData: VehicleDisplayRow[] = [];
  filteredData = [];
  pageSize = 5;
  paginationArray: number[] = [];
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  private allData: VehicleDisplayRow[] = [];

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.loadVehicles();
    this.searchSubject.pipe(debounceTime(300)).subscribe((search) => {
        this.filterData(search);
    });
  }

  loadVehicles(): void {
   this.vehicleService.getVehicles().subscribe({
      next: (res: vehicleModel[]) => {

        const processedData = res.map((vehicle) => {
          const owner = customersFromApi.find(c => c.id === vehicle.customer_id);
          const tenant = customersFromApi.find(c => c.id === vehicle.tenant_id);
          return {
            id: vehicle.id,
            plateNumber: vehicle.plate_number,
            vehicleInfo: `${vehicle.make} ${vehicle.model}`,
            ownerName: owner ? owner.fullName : 'Không rõ',
            tenantName: tenant ? tenant.fullName : 'Không rõ',
            entryDate: vehicle.created_at as Date
          };
        });
        this.allData = processedData;
        this.activeData = processedData;
        this.totalItems = this.activeData.length;
        this.changePage(1);
      },
      error: () => {
        this.allData = [];
        this.totalItems = 0;
        this.changePage(1);
      }
    });
  }

    filterData(search: string): void {
      const lowerCaseSearch = search.toLowerCase().trim();

      if (!lowerCaseSearch) {
        this.activeData = this.allData;
      } else {

        this.activeData = this.allData.filter((item) => {
           if (this.filterColumn === 'all') {
                    return item.plateNumber.toLowerCase().includes(lowerCaseSearch) ||
                        item.vehicleInfo.toLowerCase().includes(lowerCaseSearch) ||
                        item.ownerName.toLowerCase().includes(lowerCaseSearch);
                }
                else {
                    const cellValue = item[this.filterColumn];
                    if (typeof cellValue === 'string') {
                        return cellValue.toLowerCase().includes(lowerCaseSearch);
                    }
                    return false;
                }
      });
      }

      this.totalItems = this.activeData.length;
      this.changePage(1);
  }

   selectFilter(option: { key: keyof VehicleDisplayRow | 'all'; label: string }): void {
        this.filterColumn = option.key;
        this.filterColumnLabel = option.label;
        this.isFilterMenuOpen = false;
        this.filterData(this.searchText);
    };

   changePage(page: number): void {
    this.totalItems = this.activeData.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    if (page < 1 && this.totalPages > 0) {
      page = 1;
    }
    if (page > this.totalPages) {
      page = this.totalPages;
    }
    this.currentPage = page;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayData = this.activeData.slice(startIndex, startIndex + this.pageSize);

    this.updatePaginationArray();
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
    this.isCreateModalOpen = true;
  }

  openDetailModal(vehicleId: number): void {
    this.isDetailModalOpen = true;
    this.passVehicleId = vehicleId;
  }

  onSearchChange(search: string): void {
    this.searchSubject.next(search);
  }

  closeModal(type: 'create' | 'detail'): void {
    if (type === 'create') {
      this.isCreateModalOpen = false;
    } else if (type === 'detail') {
      this.isDetailModalOpen = false;
    }
  }
}
