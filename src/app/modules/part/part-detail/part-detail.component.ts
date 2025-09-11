import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PartApiItem, PartField, UpdatePart } from '@df_models/part.model';
import { PartService } from '@df_services/part.service';
import { LoadingService } from '@shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-part-detail',
    templateUrl: './part-detail.component.html',
    styleUrls: ['./part-detail.component.scss'],
})
export class PartDetailComponent implements OnInit, OnChanges {
    @Input() open: boolean = false;
    @Input() id: number;
    @Output() closed = new EventEmitter<void>();
    partSelected: PartApiItem;
    form: FormGroup;
    isEditMode: boolean = false;
    partUpdateRequest: UpdatePart;
    fields: PartField[] = [];
    isLoading: boolean = true;

    constructor(private partService: PartService, private toastrService: ToastrService, private formBuider: FormBuilder, private loadingService: LoadingService) {}
    ngOnChanges(): void {
        this.loadPartDetail();
    }

    ngOnInit(): void {}
    loadPartDetail(): boolean {
        this.loadingService.show();
        this.partService.getById(this.id).subscribe({
            next: (res: PartApiItem) => {
                this.partSelected = res;
                this.fields = [
                    { label: 'Part Name', name: 'name', type: 'text', value: this.partSelected.name },
                    { label: 'Part Code', name: 'part_number', type: 'text', value: this.partSelected.part_number },
                    { label: 'Price', name: 'default_price', type: 'text', value: this.partSelected.default_price },
                    { label: 'Cost price', name: 'cost_price', type: 'text', value: this.partSelected.name },
                    { label: 'Available', name: 'stock_quantity', type: 'number', value: this.partSelected.stock_quantity },
                    { label: 'Unit', name: 'unit', type: 'text', value: this.partSelected.unit },
                    { label: 'Supplier', name: 'supplier', type: 'text', value: this.partSelected.supplier },
                    { label: 'Gara', name: 'tenant', type: 'text', value: this.partSelected.tenant.name },
                    { label: 'Status', name: 'is_active', type: 'boolean', value: this.partSelected.is_active },
                ];
                this.loadingService.hide();
            },
            error: (err) => {
                const msg = err.error.error.join('\n');
                this.toastrService.error(msg, 'failed!');
            },
        });
        return true;
    }
    onEditClick(): void {
        this.isEditMode = true;
    }
    onCancelEdit(): void {
        this.isEditMode = false;
    }
    close(): void {
        this.closed.emit();
    }
}
