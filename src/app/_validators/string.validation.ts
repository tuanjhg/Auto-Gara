import { ValidatorFn, Validators } from '@angular/forms';
import { ValidationStringOpts } from '@df_models/validation.model';

/* eslint-disable prefer-arrow/prefer-arrow-functions */
export function validationString(otps: ValidationStringOpts): ValidatorFn[] {
    const validation: ValidatorFn[] = [];
    if (otps.required) {
        validation.push(Validators.required);
    }
    if (otps.minLength) {
        validation.push(Validators.minLength(otps.minLength));
    }
    if (otps.maxLength) {
        validation.push(Validators.maxLength(otps.maxLength));
    }
    if (otps.pattern) {
        validation.push(Validators.pattern(otps.pattern));
    }
    if (otps.email) {
        validation.push(Validators.email);
    }
    return validation;
}
