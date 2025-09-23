/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GaraDetailModel, GaraField, UpdateGaraModel } from '@df_models/gara.model';
import { UserModel } from '@df_models/user.model';
import { GaraService } from '@df_services/gara.service';
import { buildFormGroup } from '@df_validators/formSchemas/form-schema';
import { UpdateGaraSchema } from '@df_validators/formSchemas/update-gara.schema';
import { getErrorMessage, shouldShowError } from '@df_validators/messageError';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-gara-detail',
    templateUrl: './gara-detail.component.html',
    styleUrls: ['./gara-detail.component.scss'],
})
export class GaraDetailComponent implements OnInit, OnChanges {
    @Input() open = false;
    @Input() gara: GaraDetailModel;
    @Output() closed = new EventEmitter<void>();
    selectedImage: string;
    fields: GaraField[] = [];
    form: FormGroup;
    isEditMode: boolean = false;
    submitted = false;
    openDelete: boolean = false;
    isDeleting: boolean = false;
    owners: UserModel[] = [];
    constructor(private fb: FormBuilder, private garaService: GaraService, private toastr: ToastrService) {}
    ngOnInit(): void {
        this.form = buildFormGroup(this.fb, UpdateGaraSchema);
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['gara']) {
            this.loadGaraDetail();
        }
    }
    loadGaraDetail(): void {
        if (this.gara) {
            this.fields = [
                { label: 'Name', name: 'name', type: 'text', value: this.gara.name, placeholder: 'Enter Name', require: true },
                { label: 'Address', name: 'address', type: 'text', value: this.gara.address, placeholder: 'Enter Address', require: true },
                { label: 'Phone Number', name: 'phone', type: 'tel', value: this.gara.phone, placeholder: 'Enter Phone Number', require: true },
                { label: 'Email', name: 'email', type: 'email', value: this.gara.email, placeholder: 'Enter Email', require: true },
                { label: 'Owner', name: 'ownerUser', type: 'text', value: this.gara.owner?.full_name },
            ];
            this.form.patchValue(this.mapGaraToForm(this.gara));
        }
    }
    onEditClick(): void {
        this.isEditMode = true;
    }
    onFormSubmit(): void {
        const updatedData = this.form.value;
        const requestUpdate: UpdateGaraModel = {
            name: updatedData.name,
            address: updatedData.address,
            phone: updatedData.phone,
            email: updatedData.email,
            is_active: updatedData.is_active,
        };
        if (this.form.valid) {
            this.garaService.update(this.gara.tenant_id, requestUpdate).subscribe({
                next: (res: GaraDetailModel) => {
                    this.gara = res;
                    this.toastr.success('Update information successfully!', 'successfully!');
                    this.isEditMode = false;
                    this.close();
                },
                error: (err) => {
                    this.toastr.error(err.error?.error, 'failed!');
                },
            });
        }
    }
    showError = (name: string) => shouldShowError(this.form.get(name));
    getMsg = (name: string, label: string) => getErrorMessage(this.form.get(name), label);
    mapGaraToForm(gara: GaraDetailModel) {
        return {
            name: gara.name ?? '',
            address: gara.address ?? '',
            phone: gara.phone ?? null,
            email: gara.email ?? null,
            is_active: gara.is_active,
        };
    }
    onCancelEdit(): void {
        this.isEditMode = false;
        this.form.reset();
        this.form.patchValue({
            name: this.gara.name,
            address: this.gara.address,
            phone: this.gara.phone,
            email: this.gara.email,
            is_active: this.gara.is_active ?? false,
        });
    }
    close(): void {
        this.isEditMode = false;
        this.closed.emit();
    }
    openConfirmModel(): void {
        this.openDelete = true;
    }
    onCancelDelete(): void {
        if (this.isDeleting) {
            return;
        }
        this.openDelete = false;
    }
    onConfirmDelete(): void {
        this.isDeleting = true;
        this.garaService.delete(this.gara.tenant_id).subscribe({
            next: () => {
                this.isDeleting = false;
                this.openDelete = false;
                this.toastr.success('Xoá gara thành công!', 'successfully!');
                this.closed.emit();
            },
            error: () => {
                this.isDeleting = false;
                this.toastr.error('Xoá gara thất bại!', 'failed!');
            },
        });
    }
}
