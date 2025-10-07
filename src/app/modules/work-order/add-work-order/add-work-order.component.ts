/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginatedResponse } from '@df_models/api.model';
import { CustomerApiItem } from '@df_models/customer.model';
import { GaraApiItem, GaraListApiResponse } from '@df_models/gara.model';
import { vehicleModel } from '@df_models/vehicle.model';
import { AddWorkOrderField, CreateWorkOrder } from '@df_models/work-order.model';
import { CustomerService } from '@df_services/customer.service';
import { GaraService } from '@df_services/gara.service';
import { VehicleService } from '@df_services/vehicle.service';
import { WorkOrderService } from '@df_services/work-order.service';
import { createWorkOrderSchema } from '@df_validators/formSchemas/create-work-order.schema';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-add-work-order',
    templateUrl: './add-work-order.component.html',
    styleUrls: ['./add-work-order.component.scss'],
})
export class AddWorkOrderComponent implements OnInit {
    @Output() closed = new EventEmitter<void>();
    workOrderForm: FormGroup;
    currentStep = 0;
    fields: AddWorkOrderField[];
    formAdd: FormGroup;
    garas: GaraApiItem[];
    previewUrl: string | null = null;
    isDragOver = false;
    userInfo: { role: string; id: number };
    constructor(
        private formBuilder: FormBuilder,
        private garaService: GaraService,
        private workOrderService: WorkOrderService,
        private toastrService: ToastrService,
        private customerService: CustomerService,
        private vehicleService: VehicleService,
    ) {}
    ngOnInit(): void {
        this.formAdd = buildFormGroup(this.formBuilder, createWorkOrderSchema);
        this.userInfo = {
            id: Number(localStorage.getItem('id') ?? 0),
            role: localStorage.getItem('role') ?? '',
        };
        this.fields = [
            { label: 'Gara', name: 'tenant_id', type: 'select', placeholder: 'Select Gara', require: true },
            { label: 'Customer', name: 'customer_id', type: 'select', placeholder: 'Select Customer', require: true },
            { label: 'Vehicle', name: 'vehicle_id', type: 'select', placeholder: 'Select Vihecle', require: true },
            { label: 'Note', name: 'initial_notes', type: 'text', placeholder: 'Enter Note', require: true },
            { label: 'Due Date', name: 'estimated_completion_date', type: 'date', placeholder: 'Date', require: true },
            { label: 'Created By', name: 'created_by_user_id_display', type: 'readonly', displayValue: this.userInfo.role, require: true },
            { label: 'Total Paid', name: 'total_quote_price', type: 'number', placeholder: 'Enter Number', require: true },
            { label: 'Quoted Price', name: 'total_paid_amount', type: 'number', placeholder: 'Enter Number', require: true },
        ];
        console.log(this.userInfo);
        this.formAdd.patchValue({
            created_by_user_id: this.userInfo.id,
        });
        this.loadgara();
        this.formAdd.get('customer_id')?.disable({ emitEvent: false });
        this.formAdd.get('vehicle_id')?.disable({ emitEvent: false });
        this.loadgara();
        this.formAdd.get('tenant_id')?.valueChanges.subscribe((tenant_id) => {
            this.formAdd.patchValue({ customer_id: null, vehicle_id: null }, { emitEvent: false });
            this.formAdd.get('customer_id')?.disable({ emitEvent: false });
            this.formAdd.get('vehicle_id')?.disable({ emitEvent: false });
            this.updateFieldOptions('customer_id', []);
            this.updateFieldOptions('vehicle_id', []);
            if (tenant_id) {
                this.loadCustomersByTenant(tenant_id);
            }
        });
        this.formAdd.get('customer_id')?.valueChanges.subscribe((customerId) => {
            this.formAdd.patchValue({ vehicle_id: null }, { emitEvent: false });
            this.formAdd.get('vehicle_id')?.disable({ emitEvent: false });
            this.updateFieldOptions('vehicle_id', []);
            if (customerId) {
                this.loadVehiclesByCustomer(customerId);
            }
        });
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
    loadCustomersByTenant(tenantId: number) {
        this.customerService.getCustomersByTenant(tenantId).subscribe({
            next: (list: CustomerApiItem[]) => {
                const opts = (list || []).map(c => ({ label: c.full_name, value: c.customer_id }));
                this.updateFieldOptions('customer_id', opts);
                this.formAdd.get('customer_id')?.enable({ emitEvent: false });
            },
            error: () => this.toastrService.error('Failed to load customers', 'Error'),
        });
    }
    loadVehiclesByCustomer(customerId: number) {
        this.vehicleService.getPaginated().subscribe({
            next: (list: PaginatedResponse<vehicleModel>) => {
                const opts = list.data.map(v => ({ label: v.plate_number, value: v.vehicle_id }));
                this.updateFieldOptions('vehicle_id', opts);
                this.formAdd.get('vehicle_id')?.enable({ emitEvent: false });
            },
            error: () => this.toastrService.error('Failed to load vehicles', 'Error'),
        });
    }
    onSubmit(): void {
        if (this.formAdd.valid) {
            const addWorkOrdertRequest: CreateWorkOrder = this.formAdd.getRawValue();
            this.workOrderService.create(addWorkOrdertRequest).subscribe({
                next: () => {
                    this.toastrService.success('Add Work Order Successfully!', 'Successfully!');
                    this.close();
                },
                error: (err) => {
                    const msg = err.error.error.join('\n');
                    this.toastrService.error(msg, 'failed!');
                },
            });
        }
    }

    showError = (name: string) => shouldShowError(this.formAdd.get(name));
    getMsg = (name: string, label: string) => getErrorMessage(this.formAdd.get(name), label);
    close(): void {
        this.closed.emit();
    }
    private updateFieldOptions(name: string, options: Array<{ label: string; value: any }>) {
        this.fields = this.fields.map(f => (f.name === name ? { ...f, options } : f));
    }
}
