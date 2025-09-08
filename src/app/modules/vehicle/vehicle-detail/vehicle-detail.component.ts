import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleDetail, vehicleFormFields } from '../../../_models/vehicle.model';
import { VehicleService } from 'app/_services/vehicle.service';
import { GaraModel } from '../../../_models/gara.model';
import { Customer } from '../../../_models/customer.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
})
export class VehicleDetailComponent implements OnChanges, OnInit {

  @Input() vehicleId: number ;

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
  successMessage: string = '';
  validationErrors: Record<string, string> = {};

  tenants: GaraModel[] = [];
  owners: Customer[] = [];
  vehicle: VehicleDetail ;
  originalVehicle: VehicleDetail;
  imageUploadFiles: File[] = [];

  form: FormGroup;
  formFields = vehicleFormFields;

  defaultImage: string = 'https://placehold.co/600x400/e5e7eb/6b7280/png?text=No+Image+Available';

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public loadingService: LoadingService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicleId'] && changes['vehicleId'].currentValue && changes['vehicleId'].currentValue !== changes['vehicleId'].previousValue) {
      this.isInitialized = false;
      this.vehicle = null;
      this.originalVehicle = null;
      this.loadInitialData();
    }
  }

  onImageSelected(index: number): void {
  }

  onImageUpload(files: File[]): void {
    this.imageUploadFiles = files;
    delete this.validationErrors['images'];
  }


  async toggleEditMode(): Promise<void> {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.updateFormValues();
    } else {
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.validationErrors = {};
    this.errorMessage = '';

    if (this.originalVehicle) {
      this.vehicle = { ...this.originalVehicle };
      this.updateFormValues();
    }
  }

   close(): void {
      this.closeModalRequest.emit();
  }

  editVehicle(): void {
    this.toggleEditMode();
  }

  saveChanges(): void {
    if (!this.validateForm()) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.vehicle) {
      return;
    }

    this.showConfirmSave = true;
  }

  async confirmSave(): Promise<void> {
    if (!this.vehicle || !this.validateForm()) {return;}

    this.isSaving = true;
    this.loadingService.show();
    this.showConfirmSave = false;
    this.errorMessage = '';

    const updatedVehicle = this.prepareVehicleData();
    this.vehicleService.update(this.vehicle.vehicle_id, updatedVehicle).subscribe({
      next: (res) => {
        this.vehicle = this.transformApiVehicle(res);
        this.originalVehicle = { ...this.vehicle };
        this.toastr.success('Vehicle updated successfully!', 'Success!');
        this.isEditMode = false;
        if (this.vehicle) {
          this.editRequest.emit(this.vehicle.vehicle_id);
        }
        this.closeModalRequest.emit();
      },
      error: (err) => {
        this.toastr.error(err.error?.errors || 'Failed to save vehicle changes', 'Error');
      },
      complete: () => {
        this.isSaving = false;
        this.loadingService.hide();
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isValid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.valid && (control.dirty || control.touched));
  }

    confirmDelete(): void {
    this.showConfirmDelete = true;
  }

  deleteVehicle(): void {
    if (!this.vehicle) { return; }

    this.isDeleting = true;
    this.showConfirmDelete = false;
    this.errorMessage = '';

    this.vehicleService.delete(this.vehicle.vehicle_id).subscribe({
      next: () => {
        this.successMessage = 'Vehicle deleted successfully!';
        const toastRef = this.toastr.success('Vehicle deleted successfully!', 'Success!');
        toastRef.onHidden.subscribe(() => {
          if (this.vehicle) {
            this.deleteRequest.emit(this.vehicle.vehicle_id);
          }
          this.closeModalRequest.emit();
        });
      },
      error: (err) => {
        this.toastr.error(err.error?.errors || 'Failed to delete vehicle', 'Error');
      },
      complete: () => {
        this.isDeleting = false;
      }
    });
  }

  private initializeForm(): void {
    const formConfig: Record<string, any> = {};

    this.formFields.forEach((field) => {
      const controlName = field.controlName || field.name;
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.name === 'plate_number') {
        validators.push(Validators.pattern(/^[0-9]{2}[A-Z]-[0-9]{5}$/));
      }

      if (field.name === 'vin_number') {
        validators.push(Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/));
      }

      if (field.name === 'year') {
        validators.push(Validators.min(1900), Validators.max(new Date().getFullYear() + 1));
      }

      formConfig[controlName] = ['', validators];
    });

    this.form = this.fb.group(formConfig);
  }

  private updateFormValues(): void {
    if (!this.vehicle || !this.form) {return;}

    this.formFields.forEach((field) => {
      const controlName = field.controlName || field.name;
      const control = this.form.get(controlName);

      if (control && this.vehicle) {
        let value = (this.vehicle as any)[field.name];

        if (field.name === 'entryDate' && value) {
          value = new Date(value).toISOString().split('T')[0];
        }

        control.setValue(value || '');
      }
    });
  }

  private validateForm(): boolean {
    this.validationErrors = {};

    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control && control.invalid) {
          this.validationErrors[key] = this.getControlErrorMessage(key, control.errors);
        }
      });
      return false;
    }

    return true;
  }

  private getControlErrorMessage(controlName: string, errors: any): string {
    if (errors.required) {
      return `${controlName} is required`;
    }
    if (errors.pattern) {
      if (controlName === 'licensePlate') {
        return 'License plate must be in format: 29A-123.45';
      }
      if (controlName === 'vin') {
        return 'VIN must be exactly 17 characters';
      }
    }
    if (errors.min || errors.max) {
      return 'Please enter a valid year';
    }
    return 'Invalid input';
  }

  private async loadInitialData(): Promise<void> {
    if (!this.vehicleId || this.isInitialized) {
      this.isLoading = false;
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      const vehicleDetail = await this.loadVehicleDetailAsync();

      if (vehicleDetail) {
        this.vehicle = this.transformApiVehicle(vehicleDetail);
        this.originalVehicle = { ...this.vehicle };
        const detailObj = vehicleDetail as Record<string, any>;
        this.tenants = detailObj.tenant ? [detailObj.tenant] : [];
        this.owners = detailObj.customers ? [detailObj.customers] : [];
        this.updateFormValues();
        this.isInitialized = true;
      }
    } catch (error) {
      this.toastr.error('Failed to load initial data', 'Error');
    } finally {
      this.isLoading = false;
    }
  }

  private loadVehicleDetailAsync(): Promise<unknown> {
    if (!this.vehicleId) {
      return Promise.reject('No vehicle ID provided');
    }

    return new Promise((resolve, reject) => {
      this.vehicleService.getVehicleDetail(this.vehicleId).subscribe({
        next: (vehicleDetail: unknown) => {
          resolve(vehicleDetail);
        },
        error: (error) => {
          this.toastr.error('Failed to load vehicle details', 'Error');
          reject(error);
        }
      });
    });
  }



  private prepareVehicleData(): any {
    const formData = this.form.value;
    const vehicleData: any = {};

    this.formFields.forEach((field) => {
      if (field.name === 'entryDate') {
        return;
      }
      const controlName = field.controlName || field.name;
      const value = formData[controlName];
      if (value !== null && value !== undefined && value !== '') {
        vehicleData[field.name] = value;
      }
    });
    if (this.vehicle) {
      vehicleData.tenant_id = Number(formData.tenant_id ?? this.vehicle.tenant_id);
      vehicleData.customer_id = Number(formData.customer_id ?? this.vehicle.customer_id);
    }

    return vehicleData;
  }

  private transformApiVehicle(apiVehicle: any): VehicleDetail {
    return {
      vehicle_id: apiVehicle.vehicle_id ?? apiVehicle.id ?? 0,
      tenant_id: apiVehicle.tenant_id ?? 0,
      customer_id: apiVehicle.customer_id ?? 0,
      plate_number: apiVehicle.plate_number ?? '',
      make: apiVehicle.make ?? '',
      model: apiVehicle.model ?? '',
      year: apiVehicle.year ?? new Date().getFullYear(),
      color: apiVehicle.color ?? '',
      vin_number: apiVehicle.vin_number ?? '',
      status: apiVehicle.status ?? { label: 'Unknown', style: 'info' },
      images: apiVehicle.images ?? { main: this.defaultImage, thumbnails: [] },
      ownerName: apiVehicle.customers?.full_name ?? 'Unknown Owner',
      entryDate: apiVehicle.createdAt ? new Date(apiVehicle.createdAt) : new Date(),
      last_mileage: apiVehicle.last_mileage ? Number(apiVehicle.last_mileage) : 0,
    };
  }

}
