import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField,FormSection  } from '../../../_models/FormField.model';
import { vehicleFormFields } from '../../../_models/vehicle.model';
import { VehicleService } from 'app/_services/vehicle.service';
import { GaraService } from 'app/_services/gara.service';
import { CustomerService } from 'app/_services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { GaraModel } from 'app/_models/gara.model';
import { Customer } from 'app/_models/customer.model';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
})
export class AddVehicleComponent implements OnInit {
  @Output() vehicleAdded = new EventEmitter<object>();
  @Output() closeModalRequest = new EventEmitter<void>();

  formFields = vehicleFormFields;
  vehicleForm!: FormGroup;
  formSections: FormSection[] = [];
  currentStep: number = 0;
  submitted: boolean = false;
  tenants: GaraModel[] = [];
  owners: Customer[] = [];

  showConfirmModal = false;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private garaService: GaraService,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {
  }

  get currentSection(): FormSection {
  return this.formSections[this.currentStep];
}

  ngOnInit(): void {
    this.vehicleForm = this.buildForm();
    this.formSections = this.groupFieldsBySection();

    this.garaService.getAll().subscribe((response: any) => {
      this.tenants = Array.isArray(response) ? response : response.data;
    });

    this.vehicleForm.get('tenant_id')?.valueChanges.subscribe((tenant_id) => {
      if (tenant_id) {
        this.vehicleForm.get('customer_id')?.enable();
        this.customerService.getCustomersByTenant(tenant_id).subscribe((owners: any) => {
          this.owners = Array.isArray(owners) ? owners : owners.data;
        });
      } else {
        this.vehicleForm.get('customer_id')?.disable();
        this.owners = [];
        this.vehicleForm.get('customer_id')?.setValue('');
      }
    });
  }

  buildForm(): FormGroup {
    const formGroup: any = {};
    this.formFields.forEach((field) => {
      const validators = field.required ? [Validators.required] : [];
      formGroup[field.name] = ['', validators];
    });
    return this.fb.group(formGroup);
  }


nextStep(): void {
  if (this.isCurrentStepValid()) {
    if (this.currentStep < this.formSections.length - 1) {
      this.currentStep++;
    }
  } else {
    this.currentSection.fields.forEach((field: any) => {
      this.vehicleForm.get(field.name)?.markAsTouched();
    });
  }
}

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {
    const currentFields = this.currentSection.fields;
    for (const field of currentFields) {
      if (this.vehicleForm.get(field.name)?.invalid) {
        return false;
      }
    }
    return true;
  }

   groupFieldsBySection(): FormSection[] {
    const sectionTitles: { [key: string]: string } = {
      vehicle: 'Vehicle Information',
      owner: 'Owner Details',
      status: 'Initial Status',
    };

    const sectionsMap = new Map<string, FormField[]>();

    this.formFields.forEach((field) => {
      const sectionKey = field.section || 'default';
      if (!sectionsMap.has(sectionKey)) {
        sectionsMap.set(sectionKey, []);
      }
      const sectionFields = sectionsMap.get(sectionKey);
      if (sectionFields) {
        sectionFields.push(field);
      }
    });

    return Array.from(sectionsMap.entries()).map(([key, fields]) => ({
      title: sectionTitles[key] || 'Other',
      fields
    }));
  }
  close(): void {
    this.closeModalRequest.emit();
  }

  addVehicle(): void {
    this.submitted = true;
    if (this.vehicleForm.invalid) {
      return;
    }
    this.showConfirmModal = true;
  }

  onConfirmAddVehicle(): void {
    this.showConfirmModal = false;
    const formValue = this.vehicleForm.value;
    const vehicleData = {
      tenant_id: formValue.tenant_id,
      customer_id: formValue.customer_id,
      plate_number: formValue.plate_number,
      vin_number: formValue.vin_number,
      make: formValue.make,
      model: formValue.model,
      year: formValue.year,
      color: formValue.color,
    };
    this.vehicleService.create(vehicleData).subscribe({
      next: (response) => {
        this.toastr.success('Add vehicle successfully!', 'Success');
        this.vehicleAdded.emit(response as object);
        this.close();
      },
      error: (error) => {
        const message = error?.error?.message || 'Error occurs when adding a car!';
        this.toastr.error(message, 'Add a car failed');
      }
    });
  }

  onCancelAddVehicle(): void {
    this.showConfirmModal = false;
  }
}
