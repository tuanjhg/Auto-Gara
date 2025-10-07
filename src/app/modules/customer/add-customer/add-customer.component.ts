import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerField, Customer } from '@df_models/customer.model';
import { GaraService } from 'app/_services/gara.service';
import { GaraApiItem } from 'app/_models/gara.model';
import { CustomerService } from '@df_services/customer.service';
import { PaginatedResponse } from 'app/_models/api.model';
import { UpdateCustomerSchema } from '@df_validators/formSchemas/update-customer.schemas';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


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
    garaList: GaraApiItem[] = [];
    filteredGaraList: GaraApiItem[] = [];
    garaSearchControl = new FormBuilder().control('');
    isGaraLoading = false;

    constructor(
        private formBuilder: FormBuilder,
        private customerService: CustomerService,
        private toastrService: ToastrService,
        private garaService: GaraService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.loadGaraData();
        this.setupGaraSearch();
    }

    private initializeForm(): void {
        this.formAdd = buildFormGroup(this.formBuilder, UpdateCustomerSchema);
        this.fields = [
            { label: 'Gara', name: 'tenant_id', type: 'select', placeholder: 'Select Gara', require: true, value: '', options: [] },
            { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'Enter Full Name', require: true, value: '' },
            { label: 'Phone Number', name: 'phone_number', type: 'text', placeholder: 'Enter Phone Number', require: true, value: '' },
            { label: 'Email', name: 'email', type: 'text', placeholder: 'Enter Email', require: true, value: '' },
            { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter Address', require: true, value: '' },
            { label: 'Date of Birth', name: 'date_of_birth', type: 'date', placeholder: 'Enter Date of Birth', require: true, value: '' },
            { label: 'Status', name: 'is_active', type: 'boolean', placeholder: '', require: false, value: true },
            { label: 'Notes', name: 'notes', type: 'textarea', placeholder: 'Enter Notes', require: true, value: ''},
        ];
    }

    private loadGaraData(): void {
        this.isGaraLoading = true;
        this.garaService.getPaginated({ pageNumber: 1, rowsPerPage: 100 }).subscribe((response: PaginatedResponse<GaraApiItem>) => {
            this.garaList = response.data.rows;
            this.filteredGaraList = response.data.rows;
            const tenantField = this.fields.find(field => field.name === 'tenant_id');
            if (tenantField) {
                tenantField.options = response.data.rows.map((gara: GaraApiItem) => ({ value: gara.tenant_id, label: gara.name }));
            }
            this.isGaraLoading = false;
        });
    }

    private setupGaraSearch(): void {
        this.garaSearchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((search: string) => {
            this.isGaraLoading = true;
            this.garaService.getPaginated({ pageNumber: 1, rowsPerPage: 100, search }).subscribe((response: PaginatedResponse<GaraApiItem>) => {
                this.garaList = response.data.rows;
                this.filteredGaraList = response.data.rows;
                const tenantField = this.fields.find(field => field.name === 'tenant_id');
                if (tenantField) {
                    tenantField.options = response.data.rows.map((gara: GaraApiItem) => ({ value: gara.tenant_id, label: gara.name }));
                }
                this.isGaraLoading = false;
            });
        });
    }

    onSubmit(): void {
        if (this.formAdd.invalid) {
            Object.values(this.formAdd.controls).forEach(control => control.markAsTouched());
            this.toastrService.error('Please enter correctly and fully information!', 'Invalid form');
            return;
        }
        const tenant_id = this.formAdd.get('tenant_id').value;
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

