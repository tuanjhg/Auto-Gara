import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddGaralModel } from '@df_models/gara.model';
import { UserModel } from '@df_models/user.model';
import { GaraService } from '@df_services/gara.service';
import { UserService } from '@df_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-gara',
  templateUrl: './add-gara.component.html'
})
export class AddGaraComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  formAdd!: FormGroup;
  owners: UserModel[] = [];
  fields: { label: string; name: string; placeholder: string; type: string; options?: { label: string; value: string | number | boolean }[] }[] = [
    { label: 'Gara Name', name: 'name', placeholder: 'Enter gara name', type: 'text' },
    { label: 'Phone Number', name: 'phone', placeholder: 'VD: 0987654321', type: 'tel' },
    { label: 'Email', name: 'email', placeholder: 'example@gmail.com', type: 'email' },
    {
      label: 'Gara Owner',
      name: 'owner_user_id',
      placeholder: 'Owner',
      type: 'select',
    },
    {
      label: 'Status',
      name: 'is_active',
      placeholder: 'Status',
      type: 'select',
      options: [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
      ]
    },
    { label: 'Address', name: 'address', placeholder: 'Enter gara address', type: 'textarea' },
  ];

  errorMessages: Record<string, Record<string, string>> = {
    name: { required: 'Gara name is require', pattern: 'Only letters, spaces are allowed.' },
    phone: { required: 'phone number is require', pattern: 'phone number invalid (10–11 numbers)' },
    email: { required: 'Email is require', email: 'Email invalid' },
    owner_user_id: { required: 'gara owner is require' },
    is_active: { required: 'choose status' },
    address: { required: 'address is require' },
  };

  constructor(
    private fb: FormBuilder,
    private garaServive: GaraService,
    private userService: UserService,
    private toastr: ToastrService) { }
  ngOnInit(): void {
    this.initFormAdd();
    this.loadOwners();
  }
  loadOwners(): void {
    this.userService.getAllUser().subscribe({
      next: (res) => {
        const userList = res.data || [];
        this.owners = userList.filter(u => u.tenant_id === null);
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

  showError(name: string): boolean {
    const c = this.formAdd?.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }
  getError(name: string): string | null {
    const c = this.formAdd?.get(name);
    if (!c || !c.errors) { return null; }

    const map = this.errorMessages[name] || {};
    for (const key of Object.keys(map)) {
      if (c.errors[key]) { return map[key]; }
    }
  }
  initFormAdd(): FormGroup {
    return this.formAdd = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^[\p{L}\p{N}\s,./-]+$/u)
      ])],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^[0-9]{9,11}$/)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      owner_user_id: null,
      is_active: [null, Validators.compose([
        Validators.required
      ])],
      address: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^[\p{L}\p{N}\s,./-]+$/u)
      ])],
    });
  }
  onSubmit(): void {
    if (this.formAdd.valid) {
      const addGaraRequest: AddGaralModel = this.formAdd.getRawValue();
      this.garaServive.addGara(addGaraRequest).subscribe({
        next: () => {
          const toastRef = this.toastr.success('Add new gara successfully!', 'Successfully!');
          toastRef.onHidden.subscribe(() => {
            this.close();
          });
        },
        error: (err) => {
          const msg = err.error.errors.join('\n');
          this.toastr.error(msg, 'Failed!');
        }
      });
    } else {
      this.formAdd.markAllAsTouched();
    }
  }
  close(): void {
    this.closed.emit();
  }
}
