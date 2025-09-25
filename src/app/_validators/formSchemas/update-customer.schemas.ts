import { validationString } from '@df_validators/string.validation';
import { LETTERS_NUM_SPACE } from '@df_validators/patterns.validation';
import { FormSchema } from './form-schema';

const EMAIL_PATTERN = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;

export const UpdateCustomerSchema: FormSchema = {
    full_name: {
        validators: validationString({ required: true, minLength: 2, maxLength: 100, pattern: LETTERS_NUM_SPACE }),
    },
    phone_number: {
        validators: validationString({ required: true, minLength: 8, maxLength: 15 }),
    },
    email: {
        validators: validationString({ required: true, maxLength: 100, pattern: EMAIL_PATTERN }),
    },
    address: {
        validators: validationString({ required: true, maxLength: 200 }),
    },
    date_of_birth: {
        validators: validationString({ required: true }),
    },
    is_active: {
        validators: [],
    },
    notes: {
        validators: validationString({ required:true, maxLength: 500 })
    }
};
