import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserFormField } from '../../../_models/user.model';
import { UserService } from 'app/_services/user.service';
import { GaraService } from 'app/_services/gara.service';
import { ToastrService } from 'ngx-toastr';
import { GaraModel } from 'app/_models/gara.model';
import { UpdateUserSchema } from '@df_validators/formSchemas/update-user.schemas';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';
import { passwordMatchValidator } from '@df_validators/custom.validation';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
})
export class AddUserComponent implements OnInit {
    @Output() userAdded = new EventEmitter<object>();
    @Output() closeModalRequest = new EventEmitter<void>();

    userForm!: FormGroup;
    fields: (UserFormField & { placeholder: string; require: boolean; options?: { value: string; label: string }[]; defaultValue?: string | boolean })[] = [];
    tenants: GaraModel[] = [];
    showConfirmModal = false;

    constructor(private fb: FormBuilder, private userService: UserService, private garaService: GaraService, private toastr: ToastrService) {}

    ngOnInit(): void {
        this.userForm = buildFormGroup(this.fb, UpdateUserSchema, null, [passwordMatchValidator()]);
        this.buildFieldsConfig();
        this.loadTenants();
        this.setupRoleChangeListener();
        this.updateFieldsConfig();
    }

    buildFieldsConfig(): void {
        this.fields = [
            { label: 'Username', name: 'username', type: 'text', required: true, placeholder: 'Enter username', require: true },
            { label: 'Password', name: 'password', type: 'password', required: true, placeholder: 'Enter password', require: true },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true, placeholder: 'Confirm your password', require: true },
            { label: 'Full Name', name: 'full_name', type: 'text', required: true, placeholder: 'Enter full name', require: true },
            { label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'Enter email address', require: true },
            { label: 'Phone Number', name: 'phone_number', type: 'tel', required: true, placeholder: 'Enter phone number', require: true },
            {
                label: 'Role',
                name: 'role',
                type: 'select',
                required: true,
                placeholder: 'Select role',
                require: true,
                options: [
                    { value: 'admin', label: 'Admin' },
                    { value: 'owner', label: 'Owner' },
                    { value: 'mechanic', label: 'Mechanic' },
                    { value: 'accountant', label: 'Accountant' },
                ],
            },
            { label: 'Garage', name: 'tenant_id', type: 'select', required: true, placeholder: 'Select garage', require: true },
            { label: 'Status', name: 'is_active', type: 'boolean', required: false, placeholder: 'Choose status', require: false, defaultValue: true },
        ];
    }

    loadTenants(): void {
        this.garaService.getAll().subscribe((response) => {
            this.tenants = Array.isArray(response) ? (response as GaraModel[]) : (response as { data?: GaraModel[] }).data || [];
        });
    }

    setupRoleChangeListener(): void {
        this.userForm.get('role')?.valueChanges.subscribe((selectedRole) => {
            const tenantIdControl = this.userForm.get('tenant_id');
            if (!tenantIdControl) {
                return;
            }

            if (selectedRole === 'admin') {
                tenantIdControl.clearValidators();
                tenantIdControl.setValue(null);
                tenantIdControl.updateValueAndValidity();
            } else {
                tenantIdControl.setValidators([Validators.required]);
                tenantIdControl.updateValueAndValidity();
            }

            this.updateFieldsConfig();
        });
    }

    updateFieldsConfig(): void {
        const selectedRole = this.userForm.get('role')?.value;
        const tenantField = this.fields.find(field => field.name === 'tenant_id');
        if (tenantField) {
            tenantField.required = selectedRole !== 'admin';
            tenantField.require = selectedRole !== 'admin'; // For template binding
            tenantField.placeholder = selectedRole === 'admin' ? 'Select garage (optional)' : 'Select garage';
        }
    }

    onSubmit(): void {
        if (this.userForm.valid) {
            this.showConfirmModal = true;
        } else {
            this.markAllFieldsAsTouched();
            this.toastr.error('Please fill in all required fields correctly', 'Validation Error');
        }
    }

    confirmAdd(): void {
        if (this.userForm.valid) {
            const formData = this.userForm.value;
            const { confirmPassword, ...userData } = formData;

            if (userData.role === 'admin') {
                userData.tenant_id = userData.tenant_id ? Number(userData.tenant_id) : null;
            } else {
                if (userData.tenant_id) {
                    userData.tenant_id = Number(userData.tenant_id);
                }
            }

            if (userData.is_active !== undefined) {
                userData.is_active = Boolean(userData.is_active);
            }

            this.userService.create(userData).subscribe({
                next: (response) => {
                    this.toastr.success('User added successfully!', 'Success');
                    this.userAdded.emit(response.data);
                    this.closeModalRequest.emit();
                    this.showConfirmModal = false;
                },
                error: (error) => {
                    const errorMessage = error.error?.error?.join(', ') || error.error?.message || error.message || 'Failed to add user';
                    this.toastr.error(errorMessage, 'Error');
                    this.showConfirmModal = false;
                },
            });
        }
    }

    cancelAdd(): void {
        this.showConfirmModal = false;
    }

    markAllFieldsAsTouched(): void {
        Object.keys(this.userForm.controls).forEach((key) => {
            this.userForm.get(key)?.markAsTouched();
        });
    }

    close(): void {
        this.closeModalRequest.emit();
    }

    showError = (name: string): boolean => shouldShowError(this.userForm.get(name));
    getMsg = (name: string, label: string): string => getErrorMessage(this.userForm.get(name), label);
}
