import { Component, OnInit } from '@angular/core';
import { garaDetailMockData, GaraDetailModel, garaListMockData, GaraModel } from '@df_models/gara.model';
import { GaraService } from '@df_services/gara.service';

@Component({
  selector: 'app-gara-list',
  templateUrl: './gara-list.component.html',
  styleUrls: ['./gara-list.component.scss']
})
export class GaraListComponent implements OnInit {
  searchTerm: string = '';
  headers: string[] = ['Gara Name', 'Address', 'Email'];

  garas: GaraModel[] = [];
  filterGaras: GaraModel[] = [];

  isFilterOpen: boolean = false;
  selectedField: string = '';
  sortDirection: 'none' | 'asc' | 'desc' = 'none';
  sortColumn: keyof GaraModel | '' = '';

  pageSize: number = 10;
  currentPage: number = 1;

  detailOpen = false;
  selectedGara: GaraDetailModel;


  constructor(
    private garaService: GaraService,

  ) { }
  get totalPages(): number {
    return Math.ceil(this.filterGaras.length / this.pageSize);
  }
  get paginatedGaras(): GaraModel[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + +this.pageSize;
    return this.filterGaras.slice(start, end);
  }
  get paginationArray(): number[] {
    const total = this.totalPages;
    const range = 1;
    const start = Math.max(1, this.currentPage - range);
    const end = Math.min(total, this.currentPage + range);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  ngOnInit(): void {
    this.garaService.getAllGara().subscribe({
      next: (data: GaraModel[]) => {
        this.garas = data;
        this.filterGaras = [...this.garas];
      }, error: (err) => {
        console.error('Lỗi khi gọi API getAllGara:', err);
        this.garas = garaListMockData;
        this.filterGaras = [...this.garas];
      }
    });
  }
  filterData(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filterGaras = [...this.garas];
      return;
    }
    this.filterGaras = this.garas.filter((gara) => {
      if (this.selectedField === 'name') {
        return gara.name?.toLowerCase().includes(term);
      } else if (this.selectedField === 'address') {
        return gara.address?.toLowerCase().includes(term);
      } else if (this.selectedField === 'email') {
        return gara.email?.toLowerCase().includes(term);
      } else {
        return (
          gara.name?.toLowerCase().includes(term) ||
          gara.address?.toLowerCase().includes(term) ||
          gara.email?.toLowerCase().includes(term)
        );
      }
    });
  }

  selectField(field: string): void {
    this.selectedField = field;
    this.isFilterOpen = false;
    this.filterData();
  }
  getSortKey(header: string): keyof GaraModel {
    const map: { [key: string]: keyof GaraModel } = {
      'Gara Name': 'name',
      'Address': 'address',
      'Email': 'email'
    };

    return map[header] || 'name';
  }
  sortBy(header: string): void {
    const column = this.getSortKey(header);
    if (this.sortColumn === column) {
      this.toggleSortDirection();
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySortAfterFilter();
  }
  toggleSortDirection(): void {
    if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else if (this.sortDirection === 'desc') {
      this.sortDirection = 'none';
    } else {
      this.sortDirection = 'asc';
    }
  }
  applySortAfterFilter(): void {
    if (this.sortDirection === 'none') {
      this.filterData();
      return;
    }
    const list = [...this.filterGaras];
    this.filterGaras = list.sort((a, b) => {
      const valA = a[this.sortColumn]?.toLowerCase() || '';
      const valB = b[this.sortColumn]?.toLowerCase() || '';
      return this.sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }



  changePage(page: number): void {
    const total = this.totalPages;
    if (page >= 1 && page <= total) {
      this.currentPage = page;
    }
  }
  openDetail(id: string): void {
    this.detailOpen = true;
    this.garaService.getGaraById(id).subscribe({
      next: (g) => {
        this.selectedGara = g;
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu gara:', err);
        this.selectedGara = garaDetailMockData;
      }
    });
  }

  onDetailClosed(): void {
    this.detailOpen = false;
    this.selectedGara = null;
  }
}
