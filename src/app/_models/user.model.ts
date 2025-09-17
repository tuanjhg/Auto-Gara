export interface UserModel {
    id: number;
    tenant_id: number;
    username?: string; // Add username field
    full_name: string;
    phone_number: string;
    email: string;
    role: 'admin' | 'owner' | 'mechanic' | 'accountant';
    is_active: boolean;
    created_at: string;
    updated_at: string;
    tenant?: {
        tenant_id: number;
        name: string;
        address?: string;
        phone?: string;
        email?: string;
    };
}

export interface UserDisplayRow {
    user_id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    role: string;
    is_active: boolean;
    created_at: Date;
}

export interface UserDetail extends UserModel {
    username?: string;
    password?: string;
    confirmPassword?: string;
}

export interface UserFormField {
    name: string;
    label: string;
    type: 'text' | 'password' | 'email' | 'tel' | 'select' | 'checkbox';
    required: boolean;
    section: 'basic' | 'personal' | 'system';
    validators?: string[];
    options?: { value: string; label: string }[];
    defaultValue?: string | boolean;
    placeholder?: string;
}

export const userFormFields: UserFormField[] = [
    {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        section: 'basic',
        validators: ['required', 'minLength:3']
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        section: 'basic',
        validators: ['required', 'minLength:6']
    },
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        required: true,
        section: 'basic',
        validators: ['required']
    },
    {
        name: 'full_name',
        label: 'Full Name',
        type: 'text',
        required: true,
        section: 'personal',
        validators: ['required']
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        section: 'personal',
        validators: ['required', 'email']
    },
    {
        name: 'phone_number',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        section: 'personal',
        validators: ['required']
    },
    {
        name: 'role',
        label: 'Role',
        type: 'select',
        required: true,
        section: 'system',
        options: [
            { value: 'admin', label: 'Admin' },
            { value: 'owner', label: 'Owner' },
            { value: 'mechanic', label: 'Mechanic' },
            { value: 'accountant', label: 'Accountant' }
        ],
        validators: ['required']
    },
    {
        name: 'tenant_id',
        label: 'Garage',
        type: 'select',
        required: true,
        section: 'system',
        validators: ['required']
    },
    {
        name: 'is_active',
        label: 'Active',
        type: 'checkbox',
        required: false,
        section: 'system',
        defaultValue: true
    }
];
export type UserSortableFields =
    | 'username' | 'email' | 'full_name' | 'role'
    | 'created_at' | 'updated_at';
export type UserRole =
    | 'admin' | 'owner' | 'mechanic' | 'accountant';
export interface UserQueryParams {
    pageNumber?: number;
    rowsPerPage?: number;
    search?: string;
    sort?: UserSortableFields;
    order?: 'asc' | 'desc';
    tenantId?: number;
    role?: UserRole;
    isActive?: boolean;
    dateFrom?: string;
    dateTo?: string;
}
