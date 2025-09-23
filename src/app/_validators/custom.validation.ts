/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        if (password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        } else {
            if (confirmPassword.hasError('passwordMismatch')) {
                const errors = { ...confirmPassword.errors };
                delete errors['passwordMismatch'];

                if (Object.keys(errors).length === 0) {
                    confirmPassword.setErrors(null);
                } else {
                    confirmPassword.setErrors(errors);
                }
            }
        }

        return null;
    };
}

export function usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const usernamePattern = /^[a-zA-Z0-9._-]+$/;
        if (!usernamePattern.test(control.value)) {
            return { invalidUsername: true };
        }

        return null;
    };
}


export function phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const phonePattern = /^(\+84|84|0)?([3|5|7|8|9])[0-9]{8}$/;
        if (!phonePattern.test(control.value.replace(/\s/g, ''))) {
            return { invalidPhoneNumber: true };
        }

        return null;
    };
}
