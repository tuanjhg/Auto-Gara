import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() sidebarCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  userName: string = 'Cody Fisher';
  userRole: string = 'Owner';
  userAvatarUrl: string = 'assets/images/Avatar.png';
  headerTitle: string = '';
  headerSubtitle: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateHeaderContent();
    });
    this.updateHeaderContent();
  }

  updateHeaderContent(): void {
    const url = this.router.url;
    if (url.startsWith('/order')) {
      this.headerTitle = 'Order';
      this.headerSubtitle = 'Manage and track your orders';
    } else if (url.startsWith('/vehicle')) {
      this.headerTitle = 'Vehicle';
      this.headerSubtitle = 'Manage your vehicles';
    } else if (url.startsWith('/dashboard')) {
      this.headerTitle = 'Dashboard';
      this.headerSubtitle = 'Overview of your garage';
    } else if (url.startsWith('/customers')) {
      this.headerTitle = 'Customers';
      this.headerSubtitle = 'Customer management';
    } else if (url.startsWith('/inventory')) {
      this.headerTitle = 'Inventory';
      this.headerSubtitle = 'Parts and stock management';
    } else {
      this.headerTitle = 'Garage';
      this.headerSubtitle = 'Let\'s check your Garage today';
    }
  }
}
