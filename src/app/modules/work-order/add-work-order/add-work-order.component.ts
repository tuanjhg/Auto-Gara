import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { orderFormSections, ORDER_STATUS_MAP } from 'app/_models/work-order.model';
@Component({
  selector: 'app-add-work-order',
  templateUrl: './add-work-order.component.html',
  styleUrls: ['./add-work-order.component.scss']
})
export class AddWorkOrderComponent {

  @Output() closeModalRequest = new EventEmitter<void>();
  workOrderForm: FormGroup;
  orderFormSections = orderFormSections;
  currentStep = 0;


  constructor(private fb: FormBuilder) {
    this.workOrderForm = this.fb.group({
      tenant_id: ['', Validators.required],
      work_order_code: ['', Validators.required],
      vehicle_id: ['', Validators.required],
      customer_id: ['', Validators.required],
      status: ['', Validators.required],
      initial_notes: [''],
      estimated_completion_date: [''],
      total_quote_price: [''],
      total_paid_amount: [''],
      created_by_user_id: ['', Validators.required],
      completed_at: [''],
      final_check_by_user_id: [''],
      final_check_at: ['']
    });
  }

  get currentSection() {
    return this.orderFormSections[this.currentStep];
  }

  onSubmit(): void {
    if (this.workOrderForm.get('status')?.value === 'completed' && !this.workOrderForm.get('completed_at')?.value) {
      this.workOrderForm.get('completed_at')?.setErrors({ required: true });
      this.workOrderForm.markAllAsTouched();
      return;
    }
    if (this.workOrderForm.valid) {
      this.closeModal();
    } else {
      this.workOrderForm.markAllAsTouched();
    }
  }

  nextStep(): void {
    const sectionFields = this.currentSection.fields.map(f => f.name);
    let valid = true;
  sectionFields.forEach((field) => {
      const control = this.workOrderForm.get(field);
      if (control) {
        control.markAsTouched();
        if (control.invalid && this.currentSection.fields.find(f => f.name === field)?.required) {
          valid = false;
        }
      }
    });
    if (!valid) {
      return;
    }
    if (this.currentStep < this.orderFormSections.length - 1) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  close(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.closeModalRequest.emit();
  }

  getStatusClass(value: string): string {
    const found = ORDER_STATUS_MAP.find(s => s.value === value);
    return found ? found.class : '';
  }
  getFieldClass(fieldName: string): string {
  const control = this.workOrderForm.get(fieldName);
  if (!control?.touched) { return 'border-gray-200'; }
  if (control.valid) { return 'border-green-500'; }
  if (control.invalid) { return 'border-red-500'; }
  return 'border-gray-200';
}
}
