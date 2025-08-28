import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GaraDetailModel, GaraModel, UpdateGaraModel } from '@df_models/gara.model';
import { UserModel } from '@df_models/user.model';
import { GaraService } from '@df_services/gara.service';
import { UserService } from '@df_services/user.service';
import { ToastrService } from 'ngx-toastr';

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
  fields: { label: string; name: string; type: string; value: string | number; options?: { label: string; value: number }[] }[] = [];
  form: FormGroup;
  isEditMode: boolean = false;
  submitted = false;
  owners: UserModel[] = [];
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
    private garaService: GaraService,
    private toastr: ToastrService,
    private userService: UserService
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
        { label: 'Owner', name: 'ownerUser', type: 'select', value: this.gara.owner_user_id, options: [] },
      ];
      this.form = this.editForm();
      this.loadOwners();
    }

  }
  loadOwners(): void {
    const currentOwnerId = this.gara?.owner_user_id;
    this.userService.getUserFilter({ role: 'owner' }).subscribe({
      next: (res) => {
        const userList = res.data || [];
        this.owners = userList.filter(u => u.tenant_id === null || u.id === currentOwnerId);
        const ownerOptions = this.owners.map(u => ({
          label: `${u.full_name}`,
          value: u.id
        }));
        this.fields = this.fields.map(f =>
          f.name === 'owner_user_id' ? { ...f, options: ownerOptions } : f
        );
      },
      error: (err) => {
        const msg = err.error.errors.join('\n');
        this.toastr.error(msg, 'Failed!');
      }
    });


  }
  createFormWithData(): void {
    this.form = this.editForm();
  }

  editForm(): FormGroup {
    return this.form = this.fb.group({
      name: [this.gara?.name, Validators.compose([
        Validators.required,
        Validators.pattern(/^[\p{L}\p{N}\s,./-]+$/u)

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
      ownerUser: [this.gara?.owner_user_id != null ? Number(this.gara.owner_user_id) : null, Validators.compose([
        // Validators.required,
        // Validators.pattern(/^[\p{L}\p{N}\s,./-]+$/u)ß
      ])],
      is_active: [this.gara?.is_active ?? false, [Validators.required]],
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
      const requestUpdate: UpdateGaraModel = {
        name: updatedData.name,
        address: updatedData.address,
        phone: updatedData.phone,
        email: updatedData.email,
        owner_user_id: updatedData.ownerUser ?? null,
        is_active: updatedData.is_active,
      };
      this.garaService.updateGara(this.gara.tenantId, requestUpdate).subscribe({
        next: (res) => {
          this.gara = res;
          const toastRef = this.toastr.success('Update information successfully!', 'successfully!');
          toastRef.onHidden.subscribe(() => {
            this.close();
            this.isEditMode = false;

          });
        },
        error: (err) => {
          this.toastr.error(err.error?.errors, 'failed!');
        }
      });
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
    this.form.reset();
    this.form.patchValue({
      name: this.gara.name,
      address: this.gara.address,
      phone: this.gara.phone,
      email: this.gara.email,
      ownerUser: this.gara.owner_user_id != null ? Number(this.gara.owner_user_id) : null,
      is_active: this.gara.is_active ?? false,
    });
  }
  changeImage(img: string): void {
    this.selectedImage = img;
  }
  close(): void {
    this.isEditMode = false;
    this.closed.emit();
  }
}
