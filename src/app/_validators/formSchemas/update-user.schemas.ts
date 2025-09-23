import { validationString } from '@df_validators/string.validation';
import { LETTERS_NUM_SPACE } from '@df_validators/patterns.validation';
import { FormSchema } from './form-schema';
import { Validators } from '@angular/forms';
import { usernameValidator, phoneNumberValidator } from '@df_validators/custom.validation';

export const UpdateUserSchema: FormSchema = {
    username: {
        validators: [
            ...validationString({
                required: true,
                minLength: 3,
                maxLength: 50
            }),
            usernameValidator()
        ],
    },
    password: {
        validators: validationString({
            required: true,
            minLength: 6,
            maxLength: 100
        }),
    },
    confirmPassword: {
        validators: validationString({
            required: true,
            minLength: 6,
            maxLength: 100
        }),
    },
    full_name: {
        validators: validationString({
            required: true,
            minLength: 2,
            maxLength: 100,
            pattern: LETTERS_NUM_SPACE
        }),
    },
    email: {
        validators: [
            ...validationString({ required: true, maxLength: 100 }),
            Validators.email
        ],
    },
    phone_number: {
        validators: [
            ...validationString({
                required: true,
                minLength: 8,
                maxLength: 15
            }),
            phoneNumberValidator()
        ],
    },
    role: {
        validators: validationString({ required: true }),
    },
    tenant_id: {
        validators: [],
    },
    is_active: {
        validators: [],
        defaultValue: true,
    },
};

export const AddUserSchema: FormSchema = UpdateUserSchema;

export const EditUserSchema: FormSchema = {
    ...UpdateUserSchema,
    password: {
        validators: validationString({
            required: false,
            minLength: 6,
            maxLength: 100
        }),
    },
    confirmPassword: {
        validators: validationString({
            required: false,
            minLength: 6,
            maxLength: 100
        }),
    },
};
