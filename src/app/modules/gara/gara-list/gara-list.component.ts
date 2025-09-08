import { Component, OnInit } from '@angular/core';
import { GaraApiItem, GaraDetailModel, GaraListApiResponse, GaraModel } from '@df_models/gara.model';
import { GaraService } from '@df_services/gara.service';
import { LoadingService } from '@shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-gara-list',
  templateUrl: './gara-list.component.html',
  styleUrls: ['./gara-list.component.scss']
})
export class GaraListComponent implements OnInit {
  searchTerm: string = '';
  headers: string[] = ['Gara Name', 'Address', 'Email','phone', 'Owner'];

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

  openDelete: boolean = false;
  isDeleting: boolean = false;
  selectedToDelete: number;

  addOpen = false;
  private search$ = new Subject<string>();


  constructor(
    private garaService: GaraService,
    private toastr: ToastrService,
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
    this.search$.pipe(debounceTime(1500)).subscribe(() => this.filterData());
    this.loadData();
  }
  loadData(): void {
    this.loadingService.show();
    this.garaService.getPaginated({
      pageNumber: this.currentPage,
      rowsPerPage: this.pageSize,
      sort: this.sortColumn,
      order: this.sortDirection,
      search: this.searchTerm
    }).subscribe({
      next: (res: GaraListApiResponse) => {
        const data = res.data;
        const total = res.totalCount;
        if (data.length == 0 && total > 0 && this.currentPage > 1) {
          this.currentPage = this.currentPage - 1;
          this.loadData();
          return;
        }
        this.garas = res.data;
        this.totalItems = res.totalCount;
        this.loadingService.hide();
      }, error: () => {
      }
    });
  }
  filterData(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (term.valueOf) {
      this.currentPage = 1;
      this.loadData();
    }
  }
  onSearchChange(search: string): void {
    this.search$.next(search);
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
    this.garaService.getById(id).subscribe({
      next: (res: GaraDetailModel) => {
        this.selectedGara = res;
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
  openConfirmModel(id: number): void {
    this.selectedToDelete = id;
    this.openDelete = true;
  }
  onCancelDelete(): void {
    if (this.isDeleting) { return; }
    this.openDelete = false;
  }
  onConfirmDelete(): void {
    this.isDeleting = true;
    this.garaService.delete(this.selectedToDelete).subscribe({
      next: () => {
        this.isDeleting = false;
        this.openDelete = false;
        this.toastr.success('Xoá gara thành công!', 'successfully!');
        this.loadData();
      },
      error: () => {
        this.isDeleting = false;
        this.toastr.error('Xoá gara thất bại!', 'failed!');
      }
    });
  }
}
