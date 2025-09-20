/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GaraApiItem, GaraListApiResponse } from '@df_models/gara.model';
import { PartApiItem, PartField, UpdatePart } from '@df_models/part.model';
import { GaraService } from '@df_services/gara.service';
import { PartService } from '@df_services/part.service';
import { UpdatePartSchema } from '@df_validators/formSchemas/update-part.schemas';
import { LoadingService } from '@shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';

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
    isActive: boolean = true;
    garas: GaraApiItem[] = [];
    openConfirm: boolean = false;

    constructor(
        private partService: PartService,
        private toastrService: ToastrService,
        private formBuider: FormBuilder,
        private loadingService: LoadingService,
        private garaService: GaraService,
    ) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['id']) {
            this.loadPartDetail();
        }
    }
    ngOnInit(): void {
        this.form = buildFormGroup(this.formBuider, UpdatePartSchema);
    }
    loadPartDetail(): boolean {
        this.loadingService.show();
        this.partService.getById(this.id).subscribe({
            next: (res: PartApiItem) => {
                this.partSelected = res;
                this.fields = [
                    { label: 'Part Name', name: 'name', type: 'text', value: this.partSelected.name, require: true },
                    { label: 'Part Code', name: 'part_number', type: 'number', value: this.partSelected.part_number, require: true },
                    { label: 'Price', name: 'default_price', type: 'number', value: this.partSelected.default_price, require: true },
                    { label: 'Cost price', name: 'cost_price', type: 'number', value: this.partSelected.cost_price, require: true },
                    { label: 'Available', name: 'stock_quantity', type: 'number', value: this.partSelected.stock_quantity, require: true },
                    { label: 'Unit', name: 'unit', type: 'text', value: this.partSelected.unit, require: true },
                    { label: 'Supplier', name: 'supplier', type: 'text', value: this.partSelected.supplier, require: true },
                    { label: 'Gara', name: 'tenant', type: 'select', value: this.partSelected.tenant.name, options: [], require: true },
                    { label: 'Status', name: 'is_active', type: 'boolean', value: this.partSelected.is_active },
                ];
                this.form.reset(this.mapPartToForm(res), { emitEvent: false });
                this.loadgara();
                this.loadingService.hide();
            },
            error: (err) => {
                const msg = err.error.error.join('\n');
                this.toastrService.error(msg, 'failed!');
            },
        });
        return true;
    }
    loadgara(): void {
        this.garaService.getPaginated().subscribe({
            next: (res: GaraListApiResponse) => {
                const garaList = res.data || [];
                this.garas = garaList.filter(item => item.is_active === true || item.tenant_id === this.partSelected.tenant_id);
                const garaOptions = this.garas.map(gara => ({
                    label: `${gara.name}`,
                    value: gara.tenant_id,
                }));
                this.fields = this.fields.map(field => (field.name === 'tenant' ? { ...field, options: garaOptions } : field));
            },
        });
    }
    mapPartToForm(part: PartApiItem) {
        return {
            name: part.name ?? '',
            part_number: part.part_number ?? '',
            default_price: part.default_price ?? null,
            cost_price: part.cost_price ?? null,
            stock_quantity: part.stock_quantity ?? null,
            unit: part.unit ?? '',
            supplier: part.supplier ?? '',
            tenant: part.tenant_id ?? null,
            is_active: !!part.is_active,
        };
    }
    onFormSubmit(): void {
        if (this.form.valid) {
            const partUpdated = this.form.value;
            const partUpdateRequest: UpdatePart = {
                tenant_id: partUpdated.tenant,
                name: partUpdated.name,
                part_number: partUpdated.part_number,
                default_price: partUpdated.default_price,
                cost_price: partUpdated.cost_price,
                stock_quantity: partUpdated.stock_quantity,
                unit: partUpdated.unit,
                supplier: partUpdated.supplier,
                is_active: partUpdated.is_active,
            };
            this.partService.update(this.id, partUpdateRequest).subscribe({
                next: (res) => {
                    this.toastrService.success('Update part successfully!', 'successfully!');
                    this.isEditMode = false;
                    this.closed.emit();
                },
                error: (err) => {
                    const msg = err.error.error.join('\n');
                    this.toastrService.error(msg, 'Failed!');
                    this.isEditMode = false;
                    this.closed.emit();
                },
            });
        }
    }
    showError = (name: string) => shouldShowError(this.form.get(name));
    getMsg = (name: string, label: string) => getErrorMessage(this.form.get(name), label);

    isInvalid(name: string): boolean {
        const c = this.form?.get(name);
        return !!c && c.invalid && (c.dirty || c.touched);
    }
    isValid(name: string): boolean {
        const c = this.form?.get(name);
        return !!c && c.valid && (c.dirty || c.touched);
    }
    onEditClick(): void {
        this.isEditMode = true;
        this.form.markAllAsTouched();
    }
    onCancelEdit(): void {
        this.isEditMode = false;
        this.loadPartDetail();
    }
    openConfirmModel(): void {
        this.openConfirm = true;
    }
    onConfirmDelete(): void {
        this.partService.delete(this.id).subscribe({
            next: () => {
                this.toastrService.success('Delete part Successfully!', 'successfully!');
                this.openConfirm = false;
                this.closed.emit();
            },
            error: (err) => {
                const msg = err.error.error.join('\n');
                this.toastrService.error(msg, 'failed');
                this.openConfirm = false;
            },
        });
    }
    onCancelDelete(): void {
        this.openConfirm = false;
    }
    close(): void {
        this.closed.emit();
    }
}
