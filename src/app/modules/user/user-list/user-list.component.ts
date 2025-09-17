import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableColumn } from '../../../_models/FormField.model';
import { UserDisplayRow, UserModel } from '../../../_models/user.model';
import { UserService } from '@df_services/user.service';
import { GaraService } from '@df_services/gara.service';
import { GetParamRequest, PaginatedResponse } from 'app/_models/api.model';
import { Subject, of } from 'rxjs';
import { debounceTime, catchError } from 'rxjs/operators';
import { LoadingService } from 'app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { GaraModel } from 'app/_models/gara.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  isCreateModalOpen = false;
  isDetailModalOpen = false;
  searchSubject: Subject<string> = new Subject<string>();
  searchText = '';
  passUserId: number;
  showDeleteConfirm = false;

  // Tenant filter properties
  isTenantDropdownOpen = false;
  selectedTenantId: number | null = null;
  selectedTenantName: string = 'All';
  tenants: GaraModel[] = [];
  currentUserRole: string = '';
  isAdmin = false;

  tableColumns: TableColumn[] = [
    { key: 'username', label: 'Username', className: 'text-left' },
    { key: 'full_name', label: 'Full Name', className: 'text-left' },
    { key: 'email', label: 'Email', className: 'text-left' },
    { key: 'phone_number', label: 'Phone', className: 'text-left' },
    { key: 'role', label: 'Role', className: 'text-left' },
    { key: 'is_active', label: 'Status', className: 'text-center' },
    { key: 'all', label: 'All', className: 'text-right' },
    { key: 'actions', label: 'Actions', className: 'text-right' }
  ];

  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  paginationArray: number[] = [];
  sortColumn: string = 'created_at';
  sortOrder: 'asc' | 'desc' = 'desc';
  displayData: UserDisplayRow[] = [];

  constructor(
    private userService: UserService,
    private garaService: GaraService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    try {
      this.checkUserRole();
      this.loadTenants();
      this.loadUsers();
      this.searchSubject.pipe(
        debounceTime(1000),
        catchError((error) => {
          console.error('Search error:', error);
          return of('');
        })
      ).subscribe((search) => {
        console.log('Search triggered with:', search);
        this.currentPage = 1;
        this.loadUsers();
      });
    } catch (error) {
      console.error('ngOnInit error:', error);
    }
  }

  loadUsers(): void {
    this.loadingService.show();

    // Validate search text
    const searchText = this.searchText?.trim() || '';
    if (searchText.length > 0 && searchText.length < 2) {
      console.log('Search text too short, skipping search');
      this.loadingService.hide();
      return;
    }

    const params: GetParamRequest = {
      pageNumber: this.currentPage,
      rowsPerPage: this.pageSize,
      sort: this.sortColumn,
      order: this.sortOrder,
      search: searchText || undefined
    };

    // Add tenant filter for admin users
    if (this.isAdmin && this.selectedTenantId !== null) {
      (params as GetParamRequest & { tenantId?: number }).tenantId = this.selectedTenantId;
    }

    console.log('Loading users with params:', params);
    console.log('Selected tenant ID:', this.selectedTenantId);
    console.log('Is admin:', this.isAdmin);

    this.userService.getPaginated(params).subscribe({
      next: (res: PaginatedResponse<UserModel>) => {
        this.loadingService.hide();
        this.totalItems = res.totalCount;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.displayData = res.data.map(user => ({
          user_id: user.id,
          username: user.username || user.email || `User${user.id}`,
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number,
          role: this.getRoleLabel(user.role),
          is_active: user.is_active,
          created_at: new Date(user.created_at)
        }));
        this.updatePaginationArray();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        this.loadingService.hide();
        this.displayData = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.updatePaginationArray();
        this.cdr.detectChanges();
      }
    });
  }

  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'admin': 'Admin',
      'owner': 'Owner',
      'mechanic': 'Mechanic',
      'accountant': 'Accountant'
    };
    return roleLabels[role] || role;
  }

  onUserEdited(userId: number): void {
    this.loadUsers();
  }

  changePage(page: number): void {
    if (page < 1) { page = 1; }
    if (page > this.totalPages) { page = this.totalPages; }
    this.currentPage = page;
    this.loadUsers();
  }

  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadUsers();
  }

  onSearchChange(search: string): void {
    this.searchText = search;
    this.searchSubject.next(search);
  }

  openConfirmModel(userId: number): void {
    this.passUserId = userId;
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (!this.passUserId) {
      return;
    }
    this.userService.deleteUser(this.passUserId).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.passUserId = null;
        this.toastr.success('Delete user successfully!', 'Success');
        this.loadUsers();
      },
      error: () => {
        this.showDeleteConfirm = false;
        this.passUserId = null;
        this.toastr.error('Failed to delete user!', 'Error');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.passUserId = null;
    this.cdr.detectChanges();
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

  openCreateModal(): void {
    setTimeout(() => {
      this.isCreateModalOpen = true;
      this.cdr.detectChanges();
    }, 0);
  }

  openDetailModal(userId: number): void {
    console.log('Opening detail modal for userId:', userId);
    if (!userId) {
      console.error('No userId provided to openDetailModal');
      return;
    }
    this.passUserId = userId;
    this.isDetailModalOpen = true;
    console.log('Modal state set - passUserId:', this.passUserId, 'isDetailModalOpen:', this.isDetailModalOpen);
    this.cdr.detectChanges();
  }

  closeModal(type: 'create' | 'detail'): void {
    if (type === 'create') {
      this.isCreateModalOpen = false;
    } else if (type === 'detail') {
      this.isDetailModalOpen = false;
      this.passUserId = null; // Reset userId when closing modal
    }
    this.cdr.detectChanges();
  }

  checkUserRole(): void {
    let role = localStorage.getItem('role') || '';

    if (!role) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

      if (!currentUser.role) {
        currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      }

      if (!currentUser.role) {
        currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
      }

      role = currentUser.role || '';
    }

    console.log('Found role:', role);
    console.log('Available localStorage keys:', Object.keys(localStorage));

    this.currentUserRole = role;
    this.isAdmin = this.currentUserRole.toLowerCase() === 'admin';

    console.log('Current user role:', this.currentUserRole);
    console.log('Is admin:', this.isAdmin);
  }

  loadTenants(): void {
    if (!this.isAdmin) {
      return;
    }

    this.garaService.getAll().subscribe({
      next: (response) => {
        this.tenants = Array.isArray(response) ? response as GaraModel[] : (response as { data?: GaraModel[] }).data || [];
      },
      error: (error) => {
        console.error('Failed to load tenants:', error);
      }
    });
  }

  toggleTenantDropdown(): void {
    this.isTenantDropdownOpen = !this.isTenantDropdownOpen;
  }

  selectTenant(tenant: GaraModel | null): void {
    console.log('=== selectTenant called ===');
    console.log('Tenant object:', tenant);
    if (tenant) {
      const apiItem = tenant as unknown as { tenant_id?: number; tenantId?: number; name: string };
      console.log('API Item:', apiItem);
      console.log('tenant_id:', apiItem.tenant_id);
      console.log('tenantId:', apiItem.tenantId);
      this.selectedTenantId = apiItem.tenant_id || apiItem.tenantId || 0;
      this.selectedTenantName = tenant.name;
      console.log('Set selectedTenantId to:', this.selectedTenantId);
    } else {
      this.selectedTenantId = null;
      this.selectedTenantName = 'All';
      console.log('Set selectedTenantId to null (All)');
    }

    this.isTenantDropdownOpen = false;
    this.currentPage = 1;
    console.log('About to call loadUsers with selectedTenantId:', this.selectedTenantId);
    this.loadUsers();
  }

  getTenantId(tenant: GaraModel): number {
    const apiItem = tenant as unknown as { tenant_id?: number; tenantId?: number };
    return apiItem.tenant_id || apiItem.tenantId || 0;
  }

  isSelectedTenant(tenant: GaraModel): boolean {
    return this.selectedTenantId === this.getTenantId(tenant);
  }
}
