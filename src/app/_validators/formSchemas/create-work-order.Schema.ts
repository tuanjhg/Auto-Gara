/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { validationString } from '@df_validators/string.validation';
import { FormSchema } from './form-schema';
import { validationNumber } from '@df_validators/number.validation';
import { LETTERS_NUM_CODE, LETTERS_NUM_SPACE } from '@df_validators/patterns.validation';

export const createWorkOrderSchema: FormSchema = {
    tenant_id: {
        validators: validationNumber({ required: true, integer: true }),
    },
    customer_id: {
        validators: validationNumber({ required: true, integer: true }),
    },
    vehicle_id: {
        validators: validationNumber({ required: true, integer: true }),
    },
    initial_notes: {
        validators: validationString({ required: true, minLength: 2, maxLength: 50, pattern: LETTERS_NUM_SPACE }),
    },
    estimated_completion_date: {
        validators: validationString({ required: true }),
    },
    created_by_user_id: {
        validators: validationNumber({ required: true, integer: true }),
    },
    total_quote_price: {
        validators: validationNumber({ required: true, realNumber: true, min: 0, max: 1000000000 }),
    },
    total_paid_amount: {
        validators: validationNumber({ required: true, realNumber: true, min: 0, max: 1000000000 }),
    },
};
