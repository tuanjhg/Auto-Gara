import { Component, OnInit } from '@angular/core';
import { SidebarStateService } from 'app/shared/services/sidebar-state.service';

@Component({
  selector: 'classic-layout',
  templateUrl: './classic.component.html',
})
export class ClassicLayoutComponent implements OnInit {
  constructor(public sidebarState: SidebarStateService) { }

  get isSidebarCollapsed(): boolean {
    return this.sidebarState.isCollapsed;
  }

  ngOnInit(): void {}

  toggleSidebar(): void {
    this.sidebarState.isCollapsed = !this.sidebarState.isCollapsed;
  }
}
