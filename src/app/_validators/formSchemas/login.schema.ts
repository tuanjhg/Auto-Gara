/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { validationString } from '@df_validators/string.validation';
import { FormSchema } from './form-schema';

export const LoginSchema: FormSchema = {
    email: {
        validators: validationString({ required: true, email: true }),
    },
    password: {
        validators: validationString({ required: true, minLength: 6 }),
    },
};
