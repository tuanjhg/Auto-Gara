/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

export type FieldSchema = {
    validators?: ValidatorFn[];
    defaultValue?: any;
};

export type FormSchema = Record<string, FieldSchema>;

export function buildFormGroup(fb: FormBuilder, schema: FormSchema, initial?: Record<string, any>, formValidators?: ValidatorFn[]): FormGroup {
    const controlName: Record<string, FormControl> = {};
    for (const key of Object.keys(schema)) {
        const controlvalidation = schema[key];
        const init = initial && key in initial ? initial[key] : controlvalidation.defaultValue ?? null;
        controlName[key] = fb.control(init, controlvalidation.validators);
    }
    const formGroup = fb.group(controlName);

    if (formValidators && formValidators.length > 0) {
        formGroup.setValidators(formValidators);
    }

    return formGroup;
}
