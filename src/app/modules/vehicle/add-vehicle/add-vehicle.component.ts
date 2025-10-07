import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { vehicleFormFields } from '../../../_models/vehicle.model';
import { buildFormGroup } from 'app/_validators/formSchemas/form-schema';
import { VehicleSchema } from 'app/_validators/formSchemas/vehicle.schema';
import { VehicleService } from 'app/_services/vehicle.service';
import { GaraService } from 'app/_services/gara.service';
import { CustomerService } from 'app/_services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { GaraModel } from 'app/_models/gara.model';
import { Customer } from 'app/_models/customer.model';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';
import { PaginatedResponse } from 'app/_models/api.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
})
export class AddVehicleComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();

  formFields = vehicleFormFields;
  vehicleForm!: FormGroup;
  searchForm!: FormGroup;
  submitted: boolean = false;
  tenants: GaraModel[] = [];
  customer: Customer[] = [];
  filteredTenants: { value: string; label: string }[] = [];
  filteredCustomers: { value: string; label: string }[] = [];

  showConfirmModal = false;
  currentTenantId: number | null = null;
  isTenantLoading = false;
  isCustomerLoading = false;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private garaService: GaraService,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {
  }



  ngOnInit(): void {
    this.vehicleForm = buildFormGroup(this.fb, VehicleSchema);
    this.searchForm = this.fb.group({
      tenantSearch: new FormControl(''),
      customerSearch: new FormControl('')
    });
    this.loadTenants();
    this.searchForm.get('tenantSearch')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((search: string) => {
      this.loadTenants(search);
    });
    this.vehicleForm.get('tenant_id')?.valueChanges.subscribe((tenant_id) => {
      this.currentTenantId = tenant_id;
      const customerField = this.formFields.find(f => f.name === 'customer_id');
      if (tenant_id) {
        this.vehicleForm.get('customer_id')?.enable();
        this.loadCustomers(tenant_id);
      } else {
        this.vehicleForm.get('customer_id')?.disable();
        if (customerField) { customerField.options = []; this.filteredCustomers = []; }
        this.vehicleForm.get('customer_id')?.setValue('');
      }
    });
    this.searchForm.get('customerSearch')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((search: string) => {
      if (!this.currentTenantId) {
        return;
      }
      this.loadCustomers(this.currentTenantId, search);
    });
  }

  private loadTenants(search?: string): void {
    this.isTenantLoading = true;
    this.garaService.getPaginated({ pageNumber: 1, rowsPerPage: 100, search }).subscribe((response: PaginatedResponse<GaraModel>) => {
      this.tenants = response.data.rows;
      const tenantField = this.formFields.find(form => form.name === 'tenant_id');
      if (tenantField) {
        tenantField.options = response.data.rows.map((tenant: GaraModel) => ({ value: String(tenant.tenant_id), label: tenant.name }));
        this.filteredTenants = tenantField.options;
      }
      this.isTenantLoading = false;
    });
  }

  private loadCustomers(tenantId: number, search?: string): void {
    this.isCustomerLoading = true;
    this.customerService.getPaginated({ pageNumber: 1, rowsPerPage: 100, tenant_id: tenantId, search }).subscribe((response: PaginatedResponse<Customer>) => {
      this.customer = response.data.rows;
      const customerField = this.formFields.find(f => f.name === 'customer_id');
      if (customerField) {
        customerField.options = response.data.rows.map((customer: Customer) => ({ value: String(customer.customer_id), label: customer.full_name }));
        this.filteredCustomers = customerField.options;
      }
      this.isCustomerLoading = false;
    });
  }

  close(added: boolean = false): void {
    this.closed.emit(added);
  }

  addVehicle(): void {
    this.submitted = true;
    if (this.vehicleForm.invalid) {
      return;
    }
  }

  onConfirmAddVehicle(): void {
    this.showConfirmModal = false;
    const formValue = this.vehicleForm.value;
    const vehicleData = {
      tenant_id: Number(formValue.tenant_id),
      customer_id: Number(formValue.customer_id),
      plate_number: formValue.plate_number,
      vin_number: formValue.vin_number,
      make: formValue.make,
      model: formValue.model,
      year: Number(formValue.year),
      color: formValue.color,
      last_mileage: Number(formValue.last_mileage),
    };
    this.vehicleService.create(vehicleData).subscribe({
      next: () => {
        this.toastr.success('Add vehicle successfully!', 'Success');
        this.closed.emit(true);
      },
      error: (error) => {
        const message = error?.error?.message || 'Error occurs when adding a car!';
        this.toastr.error(message, 'Add a car failed');
        this.closed.emit(false);
      }
    });
  }

  onCancelAddVehicle(): void {
    this.showConfirmModal = false;
  }

  showError = (name: string): boolean => shouldShowError(this.vehicleForm.get(name));
  getMsg = (name: string, label: string): string => getErrorMessage(this.vehicleForm.get(name), label);
}
