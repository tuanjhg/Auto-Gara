import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export abstract class BaseListComponent<T> {
  isCreateModalOpen = false;
  isDetailModalOpen = false;
  isFilterMenuOpen = false;
  showDeleteConfirm = false;

  searchSubject: Subject<string> = new Subject<string>();
  searchText = '';
  filterColumn: keyof T | 'all' = 'all';
  filterColumnLabel: string = 'All';
  tableColumns: { key: keyof T | 'all' | string; label: string; className?: string }[] = [];

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  paginationArray: number[] = [];
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'desc';

  displayData: T[] = [];
  passItemId!: number;

  protected destroy$ = new Subject<void>();


  constructor(protected cdr: ChangeDetectorRef) {
    this.searchSubject.pipe(debounceTime(1000), takeUntil(this.destroy$)).subscribe(() => {
      this.currentPage = 1;
      this.loadData();
    });
  }

  selectFilter(option: { key: keyof T | 'all' | string; label: string }): void {
    this.filterColumn = option.key as keyof T | 'all';
    this.filterColumnLabel = option.label;
    this.isFilterMenuOpen = false;
    this.cdr.detectChanges();
  }


  changePage(page: number): void {
    if (page < 1) { page = 1; }
    if (page > this.totalPages) { page = this.totalPages; }
    this.currentPage = page;
    this.loadData();
  }

  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadData();
  }

  onSearchChange(search: string): void {
    this.searchText = search;
    this.searchSubject.next(search);
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


    abstract loadData(): void;
}
