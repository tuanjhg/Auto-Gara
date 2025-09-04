import { Component, OnInit } from '@angular/core';
import { GaraApiItem, GaraDetailModel, GaraModel } from '@df_models/gara.model';
import { GaraService } from '@df_services/gara.service';
import { LoadingService } from '@shared/services/loading.service';

@Component({
  selector: 'app-gara-list',
  templateUrl: './gara-list.component.html',
  styleUrls: ['./gara-list.component.scss']
})
export class GaraListComponent implements OnInit {
  searchTerm: string = '';
  headers: string[] = ['Gara Name', 'Address', 'Email', 'Owner'];

  garas: GaraApiItem[] = [];
  filterGaras: GaraApiItem[] = [];

  isFilterOpen: boolean = false;
  selectedField: string = '';
  sortDirection: 'asc' | 'desc';
  sortColumn: keyof GaraApiItem | '' = 'createdAt';

  pageSize: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;

  detailOpen = false;
  selectedGara: GaraDetailModel;

  addOpen = false;


  constructor(
    private garaService: GaraService,
    public loadingService: LoadingService

  ) { }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
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
    this.loadData();
  }
  loadData(): void {
    this.loadingService.show();
    this.garaService.getAllGara({
      pageNumber: this.currentPage,
      rowsPerPage: this.pageSize,
      sort: this.sortColumn,
      order: this.sortDirection
    }).subscribe({
      next: (res) => {
        this.garas = res.data;
        this.totalItems = res.totalCount;
        this.loadingService.hide();
      }, error: (err) => {
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
  getSortKey(header: string): keyof GaraApiItem {
    const map: { [key: string]: keyof GaraApiItem } = {
      'Gara Name': 'name',
      'Address': 'address',
      'Email': 'email'
    };

    return map[header] || 'name';
  }
  sortBy(header: string): void {
    const col = this.getSortKey(header);
    if (this.sortColumn === col) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.loadData();
  }



  changePage(page: number): void {
    const total = this.totalPages;
    if (page >= 1 && page <= total) {
      this.currentPage = page;
      this.loadData();
    }
  }
  openAdd(): void {
    this.addOpen = true;
  }
  onAddClosed(): void {
    this.addOpen = false;
    this.loadData();
  }
  openDetail(id: number): void {
    this.detailOpen = true;
    this.garaService.getGaraById(id).subscribe({
      next: (g) => {
        this.selectedGara = g;
      },
      error: (err) => {
      }
    });
  }

  onDetailClosed(): void {
    this.detailOpen = false;
    this.selectedGara = null;
    this.loadData();
  }
}
