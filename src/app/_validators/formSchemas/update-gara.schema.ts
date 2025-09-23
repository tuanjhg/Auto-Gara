import { validationString } from '@df_validators/string.validation';
import { LETTERS_NUM_SPACE } from '@df_validators/patterns.validation';
import { FormSchema } from './form-schema';
import { validationNumber } from '@df_validators/number.validation';

export const UpdateGaraSchema: FormSchema = {
    name: {
        validators: validationString({ required: true, minLength: 2, maxLength: 100, pattern: LETTERS_NUM_SPACE }),
    },
    address: {
        validators: validationString({ required: true, minLength: 8, maxLength: 255 }),
    },
    phone: {
        validators: validationNumber({ required: true, phone:true }),
    },
    email: {
        validators: validationString({ required: true,email:true }),
    },
    is_active: {
        validators: [],
    },
};
