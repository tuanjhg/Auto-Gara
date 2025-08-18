import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
features = [
  { name: 'Dashboard', icon: 'grid_view' },
  { name: 'Inventory', icon: 'inventory_2' },
  { name: 'Customers', icon: 'people' },
  { name: 'Vehicle', icon: 'car_repair' }
];

  constructor() {}

  ngOnInit(): void {
  }

 @Output() featureSelected = new EventEmitter<string>();

  onFeatureClick(feature: string) {
    this.featureSelected.emit(feature);
  }
}
