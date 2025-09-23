import { ValidatorFn, Validators } from '@angular/forms';
import { ValidationNumberOpts } from '@df_models/validation.model';
import { INTEGER_NUMBER, PHONE_NUMBER, REAL_NUMBER } from './patterns.validation';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function validationNumber(opts: ValidationNumberOpts): ValidatorFn[] {
    const validation: ValidatorFn[] = [];
    if (opts.required) {
        validation.push(Validators.required);
    }
    if (opts.min != null) {
        validation.push(Validators.min(opts.min));
    }
    if (opts.max) {
        validation.push(Validators.max(opts.max));
    }
    if (opts.minLength) {
        validation.push(Validators.minLength(opts.minLength));
    }
    if (opts.maxLength) {
        validation.push(Validators.maxLength(opts.maxLength));
    }
    if (opts.integer) {
        validation.push(Validators.pattern(INTEGER_NUMBER));
    }
    if (opts.realNumber) {
        validation.push(Validators.pattern(REAL_NUMBER));
    }
        if (opts.phone) {
        validation.push(Validators.pattern(PHONE_NUMBER));
    }
    return validation;
}
