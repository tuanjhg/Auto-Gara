import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WorkerOrderApiItem, workOrders } from 'app/_models/work-order.model';
import { WorkOrderService } from '@df_services/work-order.service';
import { LoadingService } from '@shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { SelectedTenantService } from '@shared/services/select-tenant.service';
import { WorkOrderDisplayRow } from '@df_models/work-order.model';
import { BaseListComponent } from '@shared/components/base-list.component';
import { GaraService } from '@df_services/gara.service';
import { GaraApiItem } from '@df_models/gara.model';
import { PaginatedResponse } from '@df_models/api.model';
@Component({
    selector: 'app-order',
    templateUrl: './work-order-list.component.html',
})
export class WorkOrderListComponent extends BaseListComponent<WorkerOrderApiItem> implements OnInit {
    pageSize: number = 10;
    currentPage: number = 1;
    isAddModalOpen: boolean = false;
    isDetailModalOpen: boolean = false;
    sortColumn: string;
    sortOrder: 'asc' | 'desc' = 'desc';
    selectedGarage: string | number = 'all';
    idSelected: number;
    isOpenDetail: boolean;
    openDelete: boolean;
    addOpen: boolean;
    garas: GaraApiItem[] = [];
    isGarageMenuOpen = false;

    tableColumns = [
        { key: 'work_order_code', label: 'Order Code', className: 'text-left', sortable: true },
        { key: 'vehicle.plate_number', label: 'Vehicle', className: 'text-left', sortable: false },
        { key: 'tenant.name', label: 'Tenant', className: 'text-left', sortable: false },
        { key: 'customer.full_name', label: 'Customer', className: 'text-left', sortable: false },
        { key: 'initial_notes', label: 'Description', className: 'text-left', sortable: false },
        { key: 'estimated_completion_date', label: 'Delivery Date', className: 'text-left', sortable: true },
        { key: 'status', label: 'Status', className: 'text-left', sortable: false },
        { key: 'actions', label: 'Actions', className: 'text-center', sortable: false },
    ];

    constructor(
        private workOderService: WorkOrderService,
        public loadingService: LoadingService,
        cdr: ChangeDetectorRef,
        public toastr: ToastrService,
        private selectedTenant: SelectedTenantService,
        private garaService: GaraService,
    ) {
        super(cdr);
        this.sortColumn = 'createdAt';
        this.sortOrder = 'asc';
    }
    get selectedGarageLabel(): string {
        if (this.selectedGarage === 'all') {
            return 'All';
        }
        const found = this.garas.find(g => g.tenant_id === this.selectedGarage);
        return found ? found.name : 'All';
    }

    ngOnInit(): void {
        this.loadGaras();
        const initTenant = this.selectedTenant.getTenantId();
        this.selectedGarage = initTenant != null ? initTenant : 'all';
        this.loadData();
    }
    loadData(): void {
        this.loadingService.show();
        this.workOderService
            .getPaginated({
                page_number: this.currentPage,
                rows_per_page: this.pageSize,
                sort: this.sortColumn,
                order: this.sortOrder,
                search: this.searchText.trim() || undefined,
                tenant_id: this.selectedGarage !== 'all' ? this.selectedGarage : undefined,
            })
            .subscribe({
                next: (res: PaginatedResponse<WorkerOrderApiItem>) => {
                    const total = res.data.totalCount;
                    this.totalPages = Math.ceil(total / this.pageSize);
                    this.displayData = res.data.rows;
                    this.updatePaginationArray();
                    this.cdr.detectChanges();
                    this.loadingService.hide();
                },
                error: (err) => {
                    const msg = err.error.errors.join('\n');
                    this.toastr.error(msg, 'failed!');
                    this.loadingService.hide();
                },
            });
    }
    loadGaras(): void {
        this.garaService.getAllGara().subscribe({
            next: (res: PaginatedResponse<GaraApiItem>) => {
                this.garas = Array.isArray(res) ? res : res.data.rows || [];
                if (!this.selectedGarage) {
                    this.selectedGarage = 'all';
                    this.selectedTenant.setTenantId(null, { syncUrl: true });
                }
            },
            error: () => {
                this.garas = [];
                this.selectedGarage = 'all';
                this.selectedTenant.setTenantId(null, { syncUrl: true });
            },
        });
    }

    changePage(page: number): void {
        if (page < 1 || page > this.totalPages) {
            return;
        }
        this.currentPage = page;
    }
    onPageSizeChange(): void {
        this.currentPage = 1;
    }
    openDetail(id: number): void {
        this.idSelected = id;
        this.isOpenDetail = true;
    }
    openConfirmModel(id: number): void {
        this.idSelected = id;
        this.openDelete = true;
    }
    openAdd(): void {
        this.addOpen = true;
    }
    onAddClosed(): void {
        this.addOpen = false;
        this.loadData();
    }
    selectGarage(garage: GaraApiItem | { value: 'all'; label: string }): void {
        if ('tenant_id' in garage) {
            this.selectedGarage = garage.tenant_id;
        } else {
            this.selectedGarage = garage.value;
        }
        this.selectedTenant.setTenantId(this.selectedGarage === 'all' ? null : Number(this.selectedGarage), { syncUrl: true });
        this.currentPage = 1;
        this.loadData();
        this.isFilterMenuOpen = false;
    }
    handleTableAction(event: { type: string; row: WorkOrderDisplayRow }): void {
        if (event.type === 'edit') {
            this.openDetail(event.row.work_order_id);
        } else if (event.type === 'delete') {
            this.openConfirmModel(event.row.work_order_id);
        }
    }
}
