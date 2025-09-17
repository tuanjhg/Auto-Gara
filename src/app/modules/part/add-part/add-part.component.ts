/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GaraApiItem, GaraListApiResponse } from '@df_models/gara.model';
import { CreatePart, PartAddField, PartField } from '@df_models/part.model';
import { GaraService } from '@df_services/gara.service';
import { PartService } from '@df_services/part.service';
import { createPartSchema } from '@df_validators/formSchemas/create-part.schema';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-part',
    templateUrl: './add-part.component.html',
    styleUrls: ['./add-part.component.scss'],
})
export class AddPartComponent implements OnInit {
    @Output() closed = new EventEmitter<void>();
    formAdd: FormGroup;
    fields: PartAddField[];
    garas: GaraApiItem[];

    constructor(private formBuilder: FormBuilder, private partService: PartService, private toastrService: ToastrService, private garaService: GaraService) {}

    ngOnInit(): void {
        this.formAdd = buildFormGroup(this.formBuilder, createPartSchema);
        this.fields = [
            { label: 'Part Name', name: 'name', type: 'text', placeholder: 'Enter Part Name' },
            { label: 'Part Code', name: 'part_number', type: 'number', placeholder: 'Enter Part Code' },
            { label: 'Price', name: 'default_price', type: 'number', placeholder: 'Enter Price' },
            { label: 'Cost price', name: 'cost_price', type: 'number', placeholder: 'Enter Cost Price' },
            { label: 'Available', name: 'stock_quantity', type: 'number', placeholder: 'Enter Inventory Quantity' },
            { label: 'Unit', name: 'unit', type: 'text', placeholder: 'Enter Unit' },
            { label: 'Supplier', name: 'supplier', type: 'text', placeholder: 'Enter Supplier' },
            { label: 'Gara', name: 'tenant_id', type: 'select', placeholder: 'Select Gara' },
            { label: 'Status', name: 'is_active', type: 'boolean', placeholder: 'Choose Status' },
        ];
        this.loadgara();
    }
    loadgara(): void {
        this.garaService.getPaginated().subscribe({
            next: (res: GaraListApiResponse) => {
                const garaList = res.data || [];
                this.garas = garaList.filter(item => item.is_active === true);
                const garaOptions = this.garas.map(gara => ({
                    label: `${gara.name}`,
                    value: gara.tenant_id,
                }));
                this.fields = this.fields.map(field => (field.name === 'tenant_id' ? { ...field, options: garaOptions } : field));
            },
        });
    }
    onSubmit(): void {
        if (this.formAdd.valid) {
            const addPartRequest: CreatePart = this.formAdd.getRawValue();
            this.partService.create(addPartRequest).subscribe({
                next: () => {
                    this.toastrService.success('Add Part Successfully!', 'Successfully!');
                    this.close();
                },
                error: (err) => {
                    const msg = err.error.error.join('\n');
                    this.toastrService.error(msg, 'failed!');
                    this.close();
                },
            });
        }
    }
    showError = (name: string) => shouldShowError(this.formAdd.get(name));
    getMsg = (name: string, label: string) => getErrorMessage(this.formAdd.get(name), label);
    close(): void {
        this.closed.emit();
    }
}
