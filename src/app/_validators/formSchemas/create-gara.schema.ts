/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { validationString } from '@df_validators/string.validation';
import { FormSchema } from './form-schema';
import { validationNumber } from '@df_validators/number.validation';
import { LETTERS_NUM_CODE, LETTERS_NUM_SPACE } from '@df_validators/patterns.validation';

export const CreateGaraSchema: FormSchema = {
    name: {
        validators: validationString({ required: true, minLength: 2, maxLength: 50, pattern: LETTERS_NUM_SPACE }),
    },
    address: {
        validators: validationString({ required: true, minLength: 2, maxLength: 50, pattern: LETTERS_NUM_CODE }),
    },
    phone: {
        validators: validationNumber({ required: true, realNumber: true, min: 0, max: 1000000000 }),
    },
    owner_user_id: {
        validators: validationNumber({ required: true}),
    },
    email: {
        validators: validationString({ required: true,email: true }),
    },
    is_active: {
        validators: validationString({required:true}),
    },
};
