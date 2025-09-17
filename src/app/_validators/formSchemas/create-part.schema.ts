/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { validationString } from '@df_validators/string.validation';
import { FormSchema } from './form-schema';
import { validationNumber } from '@df_validators/number.validation';
import { LETTERS_NUM_CODE, LETTERS_NUM_SPACE } from '@df_validators/patterns.validation';

export const createPartSchema: FormSchema = {
    tenant_id: {
        validators: validationNumber({ required: true, integer: true }),
    },
    name: {
        validators: validationString({ required: true, minLength: 2, maxLength: 50, pattern: LETTERS_NUM_SPACE }),
    },
    part_number: {
        validators: validationString({ required: true, minLength: 2, maxLength: 50, pattern: LETTERS_NUM_CODE }),
    },
    default_price: {
        validators: validationNumber({ required: true, realNumber: true }),
    },
    cost_price: {
        validators: validationNumber({ required: true, realNumber: true }),
    },
    stock_quantity: {
        validators: validationNumber({ required: true, integer: true }),
    },
    unit: {
        validators: validationString({ required: true, minLength: 2, maxLength: 50, pattern: LETTERS_NUM_SPACE }),
    },
    supplier: {
        validators: validationString({ required: true, minLength: 2, maxLength: 50, pattern: LETTERS_NUM_SPACE }),
    },
    is_active: {
        validators: [],
    },
};
