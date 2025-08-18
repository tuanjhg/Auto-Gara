import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormField,FormSection} from '../../../_models/FormField.model';
import {vehicleFormFields} from '../../../_models/vehicle.model'
import { VehicleService } from 'app/_services/vehicle.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
})
export class AddVehicleComponent implements OnInit {
  formFields = vehicleFormFields;
  vehicleForm!: FormGroup;
  formSections: FormSection[] = [];
  currentStep: number = 0;
  submitted: boolean = false;
  @Output() vehicleAdded = new EventEmitter<any>(); 

  @Output() closeModalRequest = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService
  ) {
  }

  ngOnInit(): void {
    this.vehicleForm = this.buildForm();
    this.formSections=this.groupFieldsBySection();
  }

  buildForm(): FormGroup {
    const formGroup: any = {};
    this.formFields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      formGroup[field.name] = ['', validators];
    });
    return this.fb.group(formGroup);
  }

  get currentSection() {
    return this.formSections[this.currentStep];
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

    this.formFields.forEach(field => {
      const sectionKey = field.section || 'default';
      if (!sectionsMap.has(sectionKey)) {
        sectionsMap.set(sectionKey, []);
      }
      sectionsMap.get(sectionKey)!.push(field);
    });

   
    return Array.from(sectionsMap.entries()).map(([key, fields]) => ({
      title: sectionTitles[key] || 'Other',
      fields: fields
    }));
  }
  close(): void {
    this.closeModalRequest.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.vehicleForm.invalid) {
      return;
    }

    const vehicleData = this.vehicleForm.value;

    this.vehicleService.addVehicle(vehicleData).subscribe({
      next: (response) => {
        this.vehicleAdded.emit(response);
        this.close();
      },
      error: (error) => {
        console.error('Error adding vehicle:', error);
      }
    });
  }
}
