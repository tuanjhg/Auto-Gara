import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddGaralModel, GaraAddField } from '@df_models/gara.model';
import { UserListApiResponse, UserModel } from '@df_models/user.model';
import { GaraService } from '@df_services/gara.service';
import { UserService } from '@df_services/user.service';
import { CreateGaraSchema } from '@df_validators/formSchemas/create-gara.schema';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-gara',
    templateUrl: './add-gara.component.html',
})
export class AddGaraComponent implements OnInit {
    @Output() closed = new EventEmitter<void>();
    formAdd!: FormGroup;
    owners: UserModel[] = [];
    fields: GaraAddField[] = [
        { label: 'Gara Owner', name: 'owner_user_id', type: 'select', placeholder: 'Owner', require: true },
        { label: 'Gara Name', name: 'name', type: 'text', placeholder: 'Enter gara name', require: true },
        { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: 'VD: 0987654321', require: true },
        { label: 'Email', name: 'email', type: 'email', placeholder: 'example@gmail.com', require: true },
        { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter gara address', require: true },
        { label: 'Status', name: 'is_active', type: 'boolean', placeholder: 'Status', require: true },
    ];
    constructor(private fb: FormBuilder, private garaServive: GaraService, private userService: UserService, private toastr: ToastrService, private router: Router) {}
    ngOnInit(): void {
        this.formAdd = buildFormGroup(this.fb, CreateGaraSchema);
        this.loadOwners();
    }
    loadOwners(): void {
        this.userService.getPaginated({ hasTenant: false }).subscribe({
            next: (res: UserListApiResponse) => {
                const userList = res.data;
                const ownerOptions = userList.map(user => ({
                    label: `${user.full_name}`,
                    value: user.id,
                }));
                this.fields = this.fields.map(field => (field.name === 'owner_user_id' ? { ...field, options: ownerOptions } : field));
            },
            error: (err) => {
                const msg = err.error.error.join('\n');
                this.toastr.error(msg, 'Failed!');
            },
        });
    }
    showError = (name: string): boolean => shouldShowError(this.formAdd.get(name));
    getMsg = (name: string, label: string): string => getErrorMessage(this.formAdd.get(name), label);

    onSubmit(): void {
        if (this.formAdd.valid) {
            const addGaraRequest: AddGaralModel = this.formAdd.getRawValue();
            this.garaServive.create(addGaraRequest).subscribe({
                next: () => {
                    this.toastr.success('Add new gara successfully!', 'Successfully!');
                },
                error: (err) => {
                    const msg = err.error.errors.join('\n');
                    this.toastr.error(msg, 'Failed!');
                },
            });
        } else {
            this.formAdd.markAllAsTouched();
        }
    }
    onCreateOwner(): void {
        this.router.navigate(['/user']);
    }
    close(): void {
        this.closed.emit();
    }
}
