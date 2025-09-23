import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-filter-bar',
  templateUrl: './common-filter-bar.component.html',
  styleUrls: ['./common-filter-bar.component.scss']
})
export class CommonFilterBarComponent {
  @Input() searchText = '';
  @Input() selectedFilterKey: string | null = null;
  @Output() searchChange = new EventEmitter<string>();
  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }
}
