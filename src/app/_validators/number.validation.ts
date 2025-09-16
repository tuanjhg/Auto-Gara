import { ValidatorFn, Validators } from '@angular/forms';
import { ValidationNumberOpts } from '@df_models/validation.model';
import { INTEGER_NUMBER, REAL_NUMBER } from './patterns.validation';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function validationNumber(otps: ValidationNumberOpts): ValidatorFn[] {
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
    if (otps.integer) {
        validation.push(Validators.pattern(INTEGER_NUMBER));
    }
    if (otps.realNumber) {
        validation.push(Validators.pattern(REAL_NUMBER));
    }
    return validation;
}
