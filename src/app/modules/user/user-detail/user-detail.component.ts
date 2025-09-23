import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserDetail, UserFormField } from '../../../_models/user.model';
import { UserService } from 'app/_services/user.service';
import { GaraModel } from '../../../_models/gara.model';
import { GaraService } from 'app/_services/gara.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnChanges, OnInit {

  @Input() userId: number;

  @Output() closeModalRequest = new EventEmitter<void>();
  @Output() editRequest = new EventEmitter<number>();
  @Output() deleteRequest = new EventEmitter<number>();

  showConfirmSave: boolean = false;
  showConfirmDelete: boolean = false;
  isLoading: boolean = false;
  isEditMode: boolean = false;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  isInitialized: boolean = false;
  errorMessage: string = '';

  tenants: GaraModel[] = [];
  user: UserDetail;
  originalUser: UserDetail;

  form: FormGroup;
  formFields: UserFormField[] = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'full_name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone_number', label: 'Phone Number', type: 'tel', required: true },
    { name: 'role', label: 'Role', type: 'select', required: true, options: [
      { value: 'admin', label: 'Admin' },
      { value: 'owner', label: 'Owner' },
      { value: 'mechanic', label: 'Mechanic' },
      { value: 'accountant', label: 'Accountant' }
    ]},
    { name: 'tenant_id', label: 'Garage', type: 'select', required: true },
    { name: 'is_active', label: 'Status', type: 'boolean', required: false, defaultValue: true }
  ];

  constructor(
    private userService: UserService,
    private garaService: GaraService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public loadingService: LoadingService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadTenants();
    if (this.userId) {
      this.loadUserDetail();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId']) {

      this.user = null;
      this.originalUser = null;
      this.isInitialized = false;
      this.errorMessage = '';
      this.isEditMode = false;

      if (this.userId) {
        this.loadUserDetail();
      }
    }
  }

  initializeForm(): void {
    const group: { [key: string]: [string | boolean, ValidatorFn[]] } = {};

    this.formFields.forEach((field) => {
      const validators: ValidatorFn[] = [];

      if (field.required && field.name !== 'password' && field.name !== 'confirmPassword') {
        validators.push(Validators.required);
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      const defaultValue = field.defaultValue !== undefined ? field.defaultValue : '';
      group[field.name] = [defaultValue, validators];
    });

    this.form = this.fb.group(group);
  }

  loadTenants(): void {
    this.garaService.getAll().subscribe((response) => {
      this.tenants = Array.isArray(response) ? response as GaraModel[] : (response as { data?: GaraModel[] }).data || [];
    });
  }

  loadUserDetail(): void {
    if (!this.userId) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.isInitialized = false;

    this.userService.getById(this.userId).subscribe({
      next: (response: { data: UserDetail } | UserDetail) => {
        if (response && 'data' in response) {
          this.user = response.data;
        } else {
          this.user = response as UserDetail;
        }

        this.originalUser = { ...this.user };
        this.populateForm();
        this.isLoading = false;
        this.isInitialized = true;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load user details';
        this.isLoading = false;
        this.isInitialized = false;
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }

  populateForm(): void {
    if (this.user && this.form) {
      const formData = {
        username: this.user.username || this.user.email || `User${this.user.id}`,
        full_name: this.user.full_name || '',
        email: this.user.email || '',
        phone_number: this.user.phone_number || '',
        role: this.user.role || '',
        tenant_id: this.user.tenant_id || '',
        is_active: this.user.is_active || false
      };
      this.form.patchValue(formData);
      this.form.updateValueAndValidity();
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.populateForm();
    }
  }

  hasChanges(): boolean {
    if (!this.originalUser || !this.form) {
      return false;
    }

    const formValue = this.form.value;
    return (
      formValue.full_name !== this.originalUser.full_name ||
      formValue.email !== this.originalUser.email ||
      formValue.phone_number !== this.originalUser.phone_number ||
      formValue.role !== this.originalUser.role ||
      formValue.is_active !== this.originalUser.is_active
    );
  }

  saveChanges(): void {
    if (this.form.valid && this.hasChanges()) {
      this.showConfirmSave = true;
    } else if (!this.hasChanges()) {
      this.toastr.info('No changes to save', 'Info');
    } else {
      this.markFormGroupTouched();
      this.toastr.error('Please fix the validation errors', 'Validation Error');
    }
  }

  confirmSave(): void {
    if (!this.form.valid || !this.hasChanges()) {
      return;
    }

    this.isSaving = true;
    this.showConfirmSave = false;

  const formData = this.form.value;

  const cleanData = {
      full_name: formData.full_name,
      email: formData.email,
      phone_number: formData.phone_number,
      role: formData.role,
      is_active: Boolean(formData.is_active)
    };

    this.userService.update(this.userId, cleanData).subscribe({
      next: (response) => {
        if (response && 'data' in response) {
          this.user = response.data;
          this.originalUser = { ...response.data };
        } else {
          this.user = response as unknown as UserDetail;
          this.originalUser = { ...this.user };
        }
        this.isEditMode = false;
        this.isSaving = false;
        this.editRequest.emit(this.userId);
        this.toastr.success('User updated successfully!', 'Success');
      },
      error: (error) => {
        this.isSaving = false;
        this.toastr.error(error.error?.message || 'Failed to update user', 'Error');
      }
    });
  }

  cancelSave(): void {
    this.showConfirmSave = false;
  }

  deleteUser(): void {
    this.showConfirmDelete = true;
  }

  confirmDelete(): void {
    this.isDeleting = true;
    this.showConfirmDelete = false;

    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.deleteRequest.emit(this.userId);
        this.toastr.success('User deleted successfully!', 'Success');
        this.closeModal();
      },
      error: (error) => {
        this.isDeleting = false;
        this.toastr.error(error.error?.message || 'Failed to delete user', 'Error');
      }
    });
  }

  cancelDelete(): void {
    this.showConfirmDelete = false;
  }

  close(): void {
    this.closeModal();
  }

  cancelEdit(): void {
    this.toggleEditMode();
  }

  markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsTouched();
    });
  }

  closeModal(): void {
    this.closeModalRequest.emit();
  }

  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'admin': 'Admin',
      'owner': 'Owner',
      'mechanic': 'Mechanic',
      'accountant': 'Accountant'
    };
    return roleLabels[role] || role;
  }

  getTenantName(tenantId: number): string {
    if (!tenantId) {
      return 'N/A';
    }

    const tenant = this.tenants.find(t => t.tenant_id === tenantId);
    return tenant?.name || 'N/A';
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const field = this.formFields.find(f => f.name === fieldName);
    return field ? field.label : fieldName;
  }
}
