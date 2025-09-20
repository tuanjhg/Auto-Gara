/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { validationString } from '@df_validators/string.validation';
import { FormSchema } from './form-schema';
import { validationNumber } from '@df_validators/number.validation';
import { LETTERS_NUM_CODE, LETTERS_NUM_SPACE } from '@df_validators/patterns.validation';

export const UpdatePartSchema: FormSchema = {
    name: {
        validators: validationString({ required: true, minLength: 2, maxLength: 100, pattern: LETTERS_NUM_SPACE }),
    },
    part_number: {
        validators: validationString({ required: true, minLength: 2, maxLength: 50, pattern: LETTERS_NUM_CODE }),
    },
    default_price: {
        validators: validationNumber({ required: true,min: 0, max: 1000000000, realNumber: true}),
    },
    cost_price: {
        validators: validationNumber({ required: true, min: 0, max: 1000000000, realNumber: true }),
    },
    stock_quantity: {
        validators: validationNumber({ required: true,min: 0, max: 1000000000, integer: true}),
    },
    unit: {
        validators: validationString({ required: true, maxLength: 20 }),
    },
    supplier: {
        validators: validationString({ required: true, maxLength: 50, pattern: LETTERS_NUM_SPACE }),
    },
    tenant: {
        validators: validationNumber({ required: true, integer: true }),
    },
    is_active: {
        validators: [],
    },
};
