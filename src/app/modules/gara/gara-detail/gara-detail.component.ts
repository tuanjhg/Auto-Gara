import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GaraDetailModel, GaraModel } from '@df_models/gara.model';
import { GaraService } from '@df_services/gara.service';

@Component({
  selector: 'app-gara-detail',
  templateUrl: './gara-detail.component.html',
  styleUrls: ['./gara-detail.component.scss']
})
export class GaraDetailComponent implements OnInit, OnChanges {
  @Input() open = false;
  @Input() gara: GaraDetailModel;
  @Output() closed = new EventEmitter<void>();
  selectedImage: string;
  fields: { label: string; name: string; type: string; value: string }[] = [];
  form: FormGroup;
  isEditMode: boolean = false;
  submitted = false;
  readonly errorMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'Name is required.',
      pattern: 'Only letters, spaces are allowed.'
    },
    address: {
      required: 'Address is required.',
      pattern: 'Use letters, numbers, spaces, , . / - only.'
    },
    phone: {
      required: 'Phone number is required.',
      pattern: 'Phone must be 9–11 digits.'
    },
    email: {
      required: 'Email is required.',
      email: 'Please enter a valid email.'
    },
    ownerUser: {
      required: 'Owner is required.',
      pattern: 'Only letters, spaces are allowed.'
    },
  };


  constructor(
    private fb: FormBuilder,
    private garaService: GaraService
  ) {
  }

  get f(): object { return this.form?.controls; }
  ngOnInit(): void {
    this.selectedImage = 'assets/imgs/tn1.jpg';
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.gara) {
      this.fields = [
        { label: 'Name', name: 'name', type: 'text', value: this.gara.name },
        { label: 'Address', name: 'address', type: 'text', value: this.gara.address },
        { label: 'Phone Number', name: 'phone', type: 'text', value: String(this.gara.phone ?? '') },
        { label: 'Email', name: 'email', type: 'email', value: this.gara.email },
        { label: 'Owner', name: 'ownerUser', type: 'text', value: this.gara.ownerUser },
      ];
      this.form = this.editForm();

    }

  }
  createFormWithData(): void {
    this.form = this.editForm();
  }

  editForm(): FormGroup {
    return this.form = this.fb.group({
      name: [this.gara?.name, Validators.compose([
        Validators.required,
        Validators.pattern(/^[\p{L}\s'.-]+$/u)
      ])],
      address: [this.gara?.address, Validators.compose([
        Validators.required,
        Validators.pattern(/^[\p{L}\p{N}\s,./-]+$/u)
      ])],
      phone: [this.gara?.phone, Validators.compose([
        Validators.required,
        Validators.pattern(/^[0-9]{9,11}$/)
      ])],
      email: [this.gara?.email, Validators.compose([
        Validators.required,
        Validators.email
      ])],
      ownerUser: [this.gara?.ownerUser, Validators.compose([
        Validators.required,
        Validators.pattern(/^[\p{L}\s'.-]+$/u)
      ])],
      isActive: [this.gara?.isActive ?? false, [Validators.required]],
    });
  }

  isInvalid(name: string): boolean {
    const c = this.form?.get(name);
    return !!c && c.invalid && (c.dirty || c.touched || this.submitted);
  }
  isValid(name: string): boolean {
    const c = this.form?.get(name);
    return !!c && c.valid && (c.dirty || c.touched || this.submitted);
  }

  showError(name: string): boolean {
    const c = this.form?.get(name);
    return !!c && c.invalid && (c.dirty || c.touched || this.submitted);
  }

  onEditClick(): void {
    this.isEditMode = true;
  }
  onFormSubmit(): void {
    if (this.form.valid) {
      const updatedData = this.form.value;
      const requestUpdate: GaraDetailModel = {
        tenantId: this.gara.tenantId,
        name: updatedData.name,
        address: updatedData.address,
        phone: updatedData.phone,
        email: updatedData.email,
        ownerUser: updatedData.ownerUser,
        isActive: updatedData.isActive,
      };
      this.garaService.updateGara(this.gara.tenantId, requestUpdate).subscribe({
        next: (res) => {
          this.gara = res;
        },
        error: (err) => {
          console.log(err + 'update fail mock data');
          this.fields = [
            { label: 'Name', name: 'name', type: 'text', value: updatedData.name },
            { label: 'Address', name: 'address', type: 'text', value: updatedData.address },
            { label: 'Phone Number', name: 'phone', type: 'text', value: String(updatedData.phone ?? '') },
            { label: 'Email', name: 'email', type: 'email', value: updatedData.email },
            { label: 'Owner', name: 'ownerUser', type: 'text', value: updatedData.ownerUser },
          ];
          this.gara.isActive = updatedData.isActive;
        }
      });
      this.isEditMode = false;
    }
  }
  getError(name: string): string | null {
    const c = this.form?.get(name);
    if (!c || !c.errors) { return null; }

    const map = this.errorMessages[name] || {};
    for (const key of Object.keys(map)) {
      if (c.errors[key]) { return map[key]; }
    }
  }
  onCancelEdit(): void {
    this.isEditMode = false;
    this.form.reset(this.gara);
  }
  changeImage(img: string): void {
    this.selectedImage = img;
  }
  close(): void {
    this.closed.emit();
  }
}
