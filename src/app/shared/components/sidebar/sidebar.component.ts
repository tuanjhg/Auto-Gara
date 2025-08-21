import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() collapsed: boolean = false;
  @Output() featureSelected = new EventEmitter<string>();

features = [
  { name: 'Dashboard', icon: 'grid_view' },
  { name: 'Inventory', icon: 'inventory_2' },
  { name: 'Customers', icon: 'people' },
  { name: 'Vehicle', icon: 'car_repair' },
  { name: 'Order', icon: 'assignment' },
  { name: 'Gara', icon: 'garage' },
  { name: 'User', icon: 'person' }
];

  constructor() {}

  ngOnInit(): void {
  }

  onFeatureClick(feature: string): void {
    this.featureSelected.emit(feature);
  }

}
