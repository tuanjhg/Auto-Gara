import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GaraApiItem } from '@df_models/gara.model';
import { PaginatedResponse } from '@df_models/api.model';
import { PartApiItem, PartDisplayRow } from '@df_models/part.model';
import { GaraService } from '@df_services/gara.service';
import { PartService } from '@df_services/part.service';
import { BaseListComponent } from '@shared/components/base-list.component';
import { LoadingService } from '@shared/services/loading.service';
import { SelectedTenantService } from '@shared/services/select-tenant.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';

@Component({
    selector: 'app-part-list',
    templateUrl: './part-list.component.html',
    styleUrls: ['./part-list.component.scss'],
})
export class PartListComponent extends BaseListComponent<PartDisplayRow> implements OnInit, AfterViewInit {
    @ViewChild('fullNameCell', { static: true }) fullNameCell: TemplateRef<unknown>;
    cellTemplates: { [key: string]: TemplateRef<unknown> } = {};
    tableColumns = [
        { key: 'part_number', label: 'Code', className: 'text-left', sortable: true },
        { key: 'name', label: 'Part Name', className: 'text-left', sortable: true },
        { key: 'supplier', label: 'Supplier', className: 'text-left', sortable: true },
        { key: 'tenant', label: 'Gara', className: 'text-left' },
        { key: 'default_price', label: 'Price', className: 'text-left' },
        { key: 'all', label: 'All', className: 'text-right' },

        { key: 'actions', label: 'Actions', className: 'text-right' },
    ];
    parts: PartApiItem[];
    totalPartRecord: number;
    pageSize: number = 10;
    currentPage: number = 1;
    sortColumn: string;
    sortOrder: 'asc' | 'desc';
    openDelete: boolean = false;
    idSelected: number;
    isOpenDetail: boolean = false;
    addOpen: boolean = false;
    garas: GaraApiItem[] = [];
    isGarageMenuOpen = false;
    selectedGarage: string | number = 'all';

    constructor(
        private partService: PartService,
        private garaService: GaraService,
        public loadingService: LoadingService,
        private toastrService: ToastrService,
        cdr: ChangeDetectorRef,
        private selectedTenant: SelectedTenantService,
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
    ngAfterViewInit(): void {
        this.cellTemplates = { name: this.fullNameCell };
    }
    loadData(): void {
        this.loadingService.show();
        this.partService
            .getPaginated({
                pageNumber: this.currentPage,
                rowsPerPage: this.pageSize,
                sort: this.sortColumn,
                order: this.sortOrder,
                search: this.searchText.trim() || undefined,
                tenant_id: this.selectedGarage !== 'all' ? this.selectedGarage : undefined,
            })
            .subscribe({
                next: (res: PaginatedResponse<PartApiItem>) => {
                    const total = res.data.totalCount;
                    this.totalPages = Math.ceil(total / this.pageSize);
                    this.displayData = res.data.rows.map(part => ({
                        part_id: part.part_id,
                        part_number: part.part_number,
                        name: part.name,
                        supplier: part.supplier,
                        tenant: part.tenant?.name || 'None',
                        default_price: part.default_price,
                        is_active: part.is_active
                    }));
                    this.updatePaginationArray();
                    this.cdr.detectChanges();
                    this.loadingService.hide();
                },
            });
    }
    loadGaras(): void {
        this.garaService.getAllGara().subscribe({
            next: (res: PaginatedResponse<GaraApiItem>) => {
                this.garas = res.data?.rows || [];
                const hasSelected = this.selectedGarage === 'all' || this.garas.some(gara => gara.tenant_id === this.selectedGarage);
                if (!hasSelected) {
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

    openConfirmModel(id: number): void {
        this.idSelected = id;
        this.openDelete = true;
    }
    onCancelDelete(): void {
        this.openDelete = false;
    }

    onConfirmDelete(): void {
        this.partService.delete(this.idSelected).subscribe({
            next: () => {
                this.openDelete = false;
                this.toastrService.success('Delete part successfully!', 'successfully');
                this.loadData();
            },
            error: (err) => {
                this.openDelete = false;
                this.toastrService.error('Delete part failed!', 'failed!');
            },
        });
    }
    openDetail(id: number): void {
        this.idSelected = id;
        this.isOpenDetail = true;
    }
    onDetailClose(): void {
        this.loadData();
        this.isOpenDetail = false;
    }
    openAdd(): void {
        this.addOpen = true;
    }
    onAddClosed(): void {
        this.addOpen = false;
        this.loadData();
    }
    handleTableAction(event: { type: string; row: PartDisplayRow }): void {
        if (event.type === 'edit') {
            this.openDetail(event.row.part_id);
        } else if (event.type === 'delete') {
            this.openConfirmModel(event.row.part_id);
        }
    }
}
