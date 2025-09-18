import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'app/_services/login.service';
import { LoadingService } from 'app/shared/services/loading.service';

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
  { name: 'Part', icon: 'inventory_2' },
  { name: 'Customer', icon: 'people' },
  { name: 'Vehicle', icon: 'car_repair' },
  { name: 'Order', icon: 'assignment' },
  { name: 'Gara', icon: 'garage' },
  { name: 'User', icon: 'person' }
];
  constructor(private loginService: LoginService,
    private router: Router,
    ) {}

  ngOnInit(): void {
  }

  onFeatureClick(feature: string): void {
    this.featureSelected.emit(feature);
  }

  onLogout(): void {
    this.loginService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
