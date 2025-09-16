import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-filter-bar',
  templateUrl: './common-filter-bar.component.html',
  styleUrls: ['./common-filter-bar.component.scss']
})
export class CommonFilterBarComponent {
  @Input() searchText = '';
  @Input() filterOptions: { key: string; label: string }[] = [];
  @Input() filterColumnLabel = 'All';
  @Input() selectedFilterKey: string | null = null;
  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ key: string; label: string }>();
  isFilterMenuOpen = false;

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }
  onFilterChange(option: { key: string; label: string }): void {
    this.filterChange.emit(option);
  }
}
