import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent<T = unknown> {
  @Input() columns: { key: string; label: string; className?: string }[] = [];
  @Input() data: T[] = [];
  @Input() sortColumn = '';
  @Input() sortOrder: 'asc' | 'desc' = 'asc';
  @Input() paginationArray: number[] = [];
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

  @Output() sort = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() action = new EventEmitter<{ type: string; row: T }>();

  onSort(colKey: string): void {
    this.sort.emit(colKey);
  }
  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }
  onAction(type: string, row: T): void {
    this.action.emit({ type, row });
  }
}
