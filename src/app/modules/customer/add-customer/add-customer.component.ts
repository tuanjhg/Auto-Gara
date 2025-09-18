
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerField, Customer } from '@df_models/customer.model';
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
    @Output() closed = new EventEmitter<void>();
    formAdd: FormGroup;
    fields: (CustomerField & { placeholder: string; require: boolean })[];

    constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private toastrService: ToastrService) {}

    ngOnInit(): void {
        this.formAdd = buildFormGroup(this.formBuilder, UpdateCustomerSchema);
        this.fields = [
            { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'Enter Full Name', require: true, value: '' },
            { label: 'Phone Number', name: 'phone_number', type: 'text', placeholder: 'Enter Phone Number', require: true, value: '' },
            { label: 'Email', name: 'email', type: 'text', placeholder: 'Enter Email', require: false, value: '' },
            { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter Address', require: false, value: '' },
            { label: 'Date of Birth', name: 'date_of_birth', type: 'date', placeholder: 'Enter Date of Birth', require: false, value: '' },
            { label: 'Status', name: 'is_active', type: 'boolean', placeholder: 'Choose Status', require: true, value: true },
        ];
    }

    onSubmit(): void {
        if (this.formAdd.valid) {
            const tenant_id = localStorage.getItem('selectedTenantId');
            const addCustomerRequest: Customer = {
                ...this.formAdd.getRawValue(),
                tenant_id
            };
            this.customerService.create(addCustomerRequest).subscribe({
                next: () => {
                    this.toastrService.success('Add Customer Successfully!', 'Successfully!');
                    this.close();
                },
                error: (err) => {
                    const msg = err.error?.error?.join('\n') || 'Add failed!';
                    this.toastrService.error(msg, 'failed!');
                    this.close();
                },
            });
        }
    }
    showError = (name: string): boolean => shouldShowError(this.formAdd.get(name));
    getMsg = (name: string, label: string): string => getErrorMessage(this.formAdd.get(name), label);
    close(): void {
        this.closed.emit();
    }
}
