import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GaraApiItem, GaraDetailModel, GaraDisplayRow, GaraListApiResponse, GaraModel } from '@df_models/gara.model';
import { GaraService } from '@df_services/gara.service';
import { BaseListComponent } from '@shared/components/base-list.component';
import { LoadingService } from '@shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';

@Component({
    selector: 'app-gara-list',
    templateUrl: './gara-list.component.html',
    styleUrls: ['./gara-list.component.scss'],
})
export class GaraListComponent extends BaseListComponent<GaraDisplayRow> implements OnInit {
    @ViewChild('nameCell', { static: true }) nameCell: TemplateRef<unknown>;
    cellTemplates: { [key: string]: TemplateRef<unknown> } = {};
    tableColumns = [
        { key: 'name', label: 'Gara Name', className: 'text-left', sortable: true },
        { key: 'address', label: 'Address', className: 'text-left', sortable: true },
        { key: 'email', label: 'Email', className: 'text-left', sortable: true },
        { key: 'phone', label: 'Phone', className: 'text-left' },
        { key: 'owner', label: 'Owner', className: 'text-left' },
        { key: 'actions', label: 'Actions', className: 'text-right' },
    ];
    sortOrder: 'asc' | 'desc' = 'desc';
    sortColumn: keyof GaraApiItem | '' = 'createdAt';

    pageSize: number = 10;
    currentPage: number = 1;

    detailOpen = false;
    selectedGara: GaraDetailModel;

    openDelete: boolean = false;
    isDeleting: boolean = false;
    selectedToDelete: number;

    addOpen = false;

    constructor(private garaService: GaraService, private toastr: ToastrService, public loadingService: LoadingService, cdr: ChangeDetectorRef) {
        super(cdr);
        this.sortColumn = 'createdAt';
        this.sortOrder = 'asc';
    }

    ngOnInit(): void {
        this.loadData();
    }
    loadData(): void {
        this.loadingService.show();
        this.garaService
            .getPaginated({
                pageNumber: this.currentPage,
                rowsPerPage: this.pageSize,
                sort: this.sortColumn,
                order: this.sortOrder,
                search: this.searchText.trim() || undefined,
            })
            .subscribe({
                next: (res: GaraListApiResponse) => {
                    const data = res.data;
                    const total = res.totalCount;
                    this.totalPages = Math.ceil(total / this.pageSize);
                    this.displayData = res.data.map(tenant => ({
                        tenant_id: tenant.tenant_id,
                        name: tenant.name,
                        phone: tenant.phone,
                        email: tenant.email,
                        owner: tenant.owner?.full_name || 'None',
                        address: tenant.address,
                    }));
                    this.updatePaginationArray();
                    this.cdr.detectChanges();
                    this.loadingService.hide();
                },
                error: () => {},
            });
    }

    openAdd(): void {
        this.addOpen = true;
    }
    onAddClosed(): void {
        this.addOpen = false;
        this.loadData();
    }
    openDetail(id: number): void {
        this.detailOpen = true;
        this.garaService.getById(id).subscribe({
            next: (res: GaraDetailModel) => {
                this.selectedGara = res;
            },
            error: (err) => {
                this.toastr.error(err.error.error.join('/n'));
            },
        });
    }

    onDetailClosed(): void {
        this.detailOpen = false;
        this.selectedGara = null;
        this.loadData();
    }
    openConfirmModel(id: number): void {
        this.selectedToDelete = id;
        this.openDelete = true;
    }
    onCancelDelete(): void {
        if (this.isDeleting) {
            return;
        }
        this.openDelete = false;
    }
    onConfirmDelete(): void {
        this.isDeleting = true;
        this.garaService.delete(this.selectedToDelete).subscribe({
            next: () => {
                this.isDeleting = false;
                this.openDelete = false;
                this.toastr.success('Xoá gara thành công!', 'successfully!');
                this.loadData();
            },
            error: () => {
                this.isDeleting = false;
                this.toastr.error('Xoá gara thất bại!', 'failed!');
            },
        });
    }

    handleTableAction(event: { type: string; row: GaraDisplayRow }): void {
        if (event.type === 'edit') {
            this.openDetail(event.row.tenant_id);
        } else if (event.type === 'delete') {
            this.openConfirmModel(event.row.tenant_id);
        }
    }
}
