import { validationString } from '@df_validators/string.validation';
import { LETTERS_NUM_SPACE } from '@df_validators/patterns.validation';
import { FormSchema } from './form-schema';

export const UpdateCustomerSchema: FormSchema = {
    full_name: {
        validators: validationString({ required: true, minLength: 2, maxLength: 100, pattern: LETTERS_NUM_SPACE }),
    },
    phone_number: {
        validators: validationString({ required: true, minLength: 8, maxLength: 15 }),
    },
    email: {
        validators: validationString({ required: false, maxLength: 100 }),
    },
    address: {
        validators: validationString({ required: false, maxLength: 200 }),
    },
    date_of_birth: {
        validators: validationString({ required: false }),
    },
    is_active: {
        validators: [],
    },
};
