import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerApiItem, CustomerField, Customer } from '@df_models/customer.model';
import { CustomerService } from '@df_services/customer.service';
import { UpdateCustomerSchema } from '@df_validators/formSchemas/update-customer.schemas';
import { LoadingService } from '@shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnInit, OnChanges {
    @Input() open: boolean = false;
    @Input() id: number;
    @Output() closed = new EventEmitter<boolean>();
    customerSelected: CustomerApiItem;
    customerForm: FormGroup;
    isEditMode: boolean = false;
    customerUpdateRequest: Customer;
    fields: CustomerField[] = [];
    openConfirm: boolean = false;

    constructor(
        private customerService: CustomerService,
        private toastrService: ToastrService,
        private formBuilder: FormBuilder,
        public loadingService: LoadingService,
    ) { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['id']) {
            this.loadCustomerDetail();
        }
    }
    ngOnInit(): void {
        this.customerForm = buildFormGroup(this.formBuilder, UpdateCustomerSchema);
    }
    loadCustomerDetail(): boolean {
        this.loadingService.show();
        this.customerService.getById(this.id).subscribe({
            next: (res: CustomerApiItem) => {
                this.customerSelected = res;
                this.fields = [
                    { label: 'Full Name', name: 'full_name', type: 'text', value: this.customerSelected.full_name },
                    { label: 'Phone Number', name: 'phone_number', type: 'text', value: this.customerSelected.phone_number },
                    { label: 'Email', name: 'email', type: 'text', value: this.customerSelected.email },
                    { label: 'Address', name: 'address', type: 'text', value: this.customerSelected.address },
                    { label: 'Date of Birth', name: 'date_of_birth', type: 'date', value: this.customerSelected.date_of_birth },
                    { label: 'Status', name: 'is_active', type: 'boolean', value: this.customerSelected.is_active },
                ];
                this.customerForm.reset(this.mapCustomerToForm(res), { emitEvent: false });
                this.loadingService.hide();
            },
            error: (err) => {
                const msg = err.error.error.join('\n');
                this.toastrService.error(msg, 'failed!');
            },
        });
        return true;
    }
    mapCustomerToForm(customer: CustomerApiItem): Partial<Customer> {
        return {
            full_name: customer.full_name,
            phone_number: customer.phone_number,
            email: customer.email,
            address: customer.address,
            is_active: customer.is_active,
            date_of_birth: customer.date_of_birth,
        };
    }
    onEditClick(): void {
        this.isEditMode = true;
    }
    onCancelEdit(): void {
        this.isEditMode = false;
    }
    onFormSubmit(): void {
        if (this.customerForm.invalid) {
            return;
        }
        this.customerUpdateRequest = {
            ...this.customerForm.value,
            tenant_id: this.customerSelected.tenant_id
        };
        this.customerService.update(this.id, this.customerUpdateRequest).subscribe({
            next: () => {
                this.toastrService.success('Customer updated successfully!');
                this.isEditMode = false;
                this.loadCustomerDetail();
                this.closed.emit(true);
            },
            error: (error) => {
                this.toastrService.error(getErrorMessage(this.customerForm, error), 'Update failed!');
                this.closed.emit(false);
            },
        });
    }
    openConfirmModal(): void {
        this.openConfirm = true;
    }
    close(): void {
        this.closed.emit(false);
    }
    showError(field: string): boolean {
        return shouldShowError(this.customerForm.get(field));
    }
    getErorrMessage(field: string, label: string): string {
        return getErrorMessage(this.customerForm.get(field), label);
    }

    onConfirmDelete(): void {
        this.customerService.delete(this.id).subscribe({
            next: () => {
                this.toastrService.success('Delete customer successfully!');
                this.openConfirm = false;
                this.closed.emit();
            },
            error: (error) => {
                this.toastrService.error(getErrorMessage(this.customerForm, error), 'Delete failed!');
                this.openConfirm = false;
            },
        });
    }

    onCancelDelete(): void {
        this.openConfirm = false;
    }
}
