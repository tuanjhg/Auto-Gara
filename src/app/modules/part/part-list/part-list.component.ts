import { Component, OnInit } from '@angular/core';
import { PartApiItem, PartListApiResponse } from '@df_models/part.model';
import { PartService } from '@df_services/part.service';
import { LoadingService } from '@shared/services/loading.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';

@Component({
    selector: 'app-part-list',
    templateUrl: './part-list.component.html',
    styleUrls: ['./part-list.component.scss'],
})
export class PartListComponent implements OnInit {
    headers: string[] = ['Code', 'Part Name', 'supplier', 'Gara', 'Price'];
    parts: PartApiItem[];
    totalPartRecord: number;
    pageSize: number = 10;
    currentPage: number = 1;
    search$ = new Subject<string>();
    searchTerm: string = '';
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    openDelete: boolean = false;
    idSelected: number = 1;
    isOpenDetail: boolean = false;

    constructor(private partService: PartService, public loadingService: LoadingService, private toastrService: ToastrService) {}
    get totalPages(): number {
        return Math.max(1, Math.ceil(this.totalPartRecord / this.pageSize));
    }
    get paginationArray(): number[] {
        const total = this.totalPages;
        const range = 1;
        const start = Math.max(1, this.currentPage - range);
        const end = Math.min(total, this.currentPage + range);
        const pages: number[] = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }

    ngOnInit(): void {
        this.search$.pipe(debounceTime(1000)).subscribe(() => {
            this.filterData();
        });
        this.loadData();
    }
    loadData(): void {
        this.loadingService.show();
        this.partService
            .getPaginated({
                pageNumber: this.currentPage,
                rowsPerPage: this.pageSize,
                sort: this.sortColumn,
                order: this.sortDirection,
                search: this.searchTerm,
            })
            .subscribe({
                next: (res: PartListApiResponse) => {
                    const data = res.data;
                    const total = res.totalCount;
                    if (data.length == 0 && total > 0 && this.currentPage > 1) {
                        this.currentPage = this.currentPage - 1;
                        this.loadData();
                        return;
                    }
                    this.parts = res.data;
                    this.totalPartRecord = res.totalCount;
                    this.loadingService.hide();
                },
            });
    }
    onSearchChange(search: string): void {
        this.search$.next(search);
    }
    filterData(): void {
        this.currentPage = 1;
        this.loadData();
    }
    changePage(page: number): void {
        const total = this.totalPages;
        if (page >= 1 && page <= total) {
            this.currentPage = page;
            this.loadData();
        }
    }
    getSortKey(header: string): keyof PartApiItem {
        const map: { [key: string]: keyof PartApiItem } = {
            'Part Name': 'name',
            'Code': 'part_number',
            'Price': 'default_price',
            'supplier': 'supplier',
            'Gara': 'tenant',
        };
        return map[header] || 'name';
    }
    sortBy(header: string): void {
        const col = this.getSortKey(header);
        if (header === 'Gara') {
            return;
        }
        if (this.sortColumn === col) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = col;
            this.sortDirection = 'asc';
        }
        this.currentPage = 1;
        this.loadData();
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
}
