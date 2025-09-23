import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

interface RouteData {
  [key: string]: unknown;
  headerTitle?: string;
  headerSubtitle?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() sidebarCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  userName: string = 'Cody Fisher';
  userRole: string = 'Owner';
  userAvatarUrl: string = 'favicon-16x16.png';
  headerTitle: string = 'Dashboard';
  headerSubtitle: string = 'Overview of your garage';
  isDropdownOpen: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getRouteData())
    ).subscribe((data: RouteData) => {
      this.updateHeaderFromRouteData(data);
    });
    this.updateHeaderFromRouteData(this.getRouteData());
  }

  private getRouteData(): RouteData {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data;
  }

  private updateHeaderFromRouteData(data: RouteData): void {
    this.headerTitle = data['headerTitle'] || 'Dashboard';
    this.headerSubtitle = data['headerSubtitle'] || 'Overview of your garage';
  }
}
