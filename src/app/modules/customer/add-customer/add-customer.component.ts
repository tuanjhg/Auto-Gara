import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerField, Customer } from '@df_models/customer.model';
import { GaraService } from 'app/_services/gara.service';
import { GaraModel } from 'app/_models/gara.model';
import { CustomerService } from '@df_services/customer.service';
import { UpdateCustomerSchema } from '@df_validators/formSchemas/update-customer.schemas';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
    @Output() closed = new EventEmitter<boolean>();
    formAdd: FormGroup;
    fields: (CustomerField & { placeholder: string; require: boolean })[];
    showConfirm = false;
    tenants: GaraModel[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private customerService: CustomerService,
        private toastrService: ToastrService,
        private garaService: GaraService
    ) {}

    ngOnInit(): void {
        this.formAdd = buildFormGroup(this.formBuilder, UpdateCustomerSchema);
        this.fields = [
            { label: 'Tenant', name: 'tenant_id', type: 'select', placeholder: 'Select Tenant', require: true, value: '', options: [] },
            { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'Enter Full Name', require: true, value: '' },
            { label: 'Phone Number', name: 'phone_number', type: 'text', placeholder: 'Enter Phone Number', require: true, value: '' },
            { label: 'Email', name: 'email', type: 'text', placeholder: 'Enter Email', require: true, value: '' },
            { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter Address', require: true, value: '' },
            { label: 'Date of Birth', name: 'date_of_birth', type: 'date', placeholder: 'Enter Date of Birth', require: true, value: '' },
            { label: 'Status', name: 'is_active', type: 'boolean', placeholder: '', require: false, value: true },
            { label: 'Notes', name: 'notes', type: 'textarea', placeholder: 'Enter Notes', require: true, value: ''},
        ];
        this.garaService.getAll().subscribe((response: any) => {
            const tenants = Array.isArray(response) ? response : response.data;
            this.tenants = tenants;
            const tenantField = this.fields.find(field => field.name === 'tenant_id');
            if (tenantField) {
                tenantField.options = tenants.map((tenant: GaraModel) => ({ value: tenant.tenant_id, label: tenant.name }));
            }
        });
    }

    onSubmit(): void {
        if (this.formAdd.invalid) {
            Object.values(this.formAdd.controls).forEach(control => control.markAsTouched());
            this.toastrService.error('Please enter correctly and fully information!', 'Invalid form');
            return;
        }
        const tenant_id = Number(localStorage.getItem('selectedTenantId'));
        const addCustomerRequest: Customer = {
            ...this.formAdd.value,
            tenant_id
        };
        this.customerService.create(addCustomerRequest).subscribe({
            next: () => {
                this.toastrService.success('Add Customer Successfully!', 'Successfully!');
                this.close(true);
            },
            error: (err) => {
                const msg = err.error?.error?.join('\n') || 'Add failed!';
                this.toastrService.error(msg, 'failed!');
                this.close(false);
            },
        });
    }

    onConfirmAddCustomer(): void {
        this.showConfirm = false;
        this.onSubmit();
    }

    showError = (name: string): boolean => shouldShowError(this.formAdd.get(name));
    getMsg = (name: string, label: string): string => getErrorMessage(this.formAdd.get(name), label);
    close(added: boolean = false): void {
        this.closed.emit(added);
    }
}

